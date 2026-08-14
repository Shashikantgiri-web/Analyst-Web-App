-- Adds department-average comparison data to employee_own_overview(), so
-- the Employee dashboard can show "You vs. Your Department Average" --
-- the one chart type that actually makes sense for a single person's
-- view (a distribution/pie chart doesn't, since there's only one data
-- point).

create or replace function employee_own_overview(emp_id uuid)
returns json
language sql
stable
as $$
  with latest_metrics as (
    select distinct on (employee_id) *
    from employee_metrics
    order by employee_id, updated_at desc nulls last, created_at desc nulls last
  ),
  department_peers as (
    select m.*
    from employees e
    join latest_metrics m on m.employee_id = e.id
    where e.department_id = (select department_id from employees where id = emp_id)
  )
  select json_build_object(
    'employee', (
      select json_build_object(
        'id', e.id,
        'employeeCode', e.employee_code,
        'jobTitle', e.job_title,
        'departmentName', d.department_name,
        'hireDate', e.hire_date,
        'yearsAtCompany', e.years_at_company
      )
      from employees e
      left join departments d on d.id = e.department_id
      where e.id = emp_id
    ),
    'metrics', (
      select json_build_object(
        'performanceScore', m.performance_score,
        'performanceRating', pr.name,
        'monthlySalary', m.monthly_salary,
        'trainingHours', coalesce(m.training_hours_calc, m.training_hours),
        'workHoursPerWeek', coalesce(m.work_hours_per_week_calc, m.work_hours_per_week),
        'projectsHandled', m.projects_handled,
        'satisfactionScore', m.emp_satisfaction_score,
        'satisfactionRating', sr.name,
        'workLifeBalance', m.work_life_balance,
        'sickDays', coalesce(m.sick_days_calc, m.sick_days),
        'promotions', m.promotions
      )
      from latest_metrics m
      left join performance_ratings pr on pr.id = m.performance_rating_id
      left join satisfaction_ratings sr on sr.id = m.satisfaction_rating_id
      where m.employee_id = emp_id
    ),
    'departmentComparison', (
      select json_build_object(
        'performanceScore', json_build_object(
          'you', (select performance_score from latest_metrics where employee_id = emp_id),
          'departmentAvg', (select avg(performance_score) from department_peers)
        ),
        'satisfactionScore', json_build_object(
          'you', (select emp_satisfaction_score from latest_metrics where employee_id = emp_id),
          'departmentAvg', (select avg(emp_satisfaction_score) from department_peers)
        ),
        'trainingHours', json_build_object(
          'you', (
            select coalesce(training_hours_calc, training_hours)
            from latest_metrics where employee_id = emp_id
          ),
          'departmentAvg', (
            select avg(coalesce(training_hours_calc, training_hours)) from department_peers
          )
        ),
        'workHoursPerWeek', json_build_object(
          'you', (
            select coalesce(work_hours_per_week_calc, work_hours_per_week)
            from latest_metrics where employee_id = emp_id
          ),
          'departmentAvg', (
            select avg(coalesce(work_hours_per_week_calc, work_hours_per_week)) from department_peers
          )
        )
      )
    )
  );
$$;

grant execute on function employee_own_overview(uuid) to service_role, authenticated, anon;
