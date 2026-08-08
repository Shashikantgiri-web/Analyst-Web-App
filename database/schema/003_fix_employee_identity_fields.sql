-- Fixes manager_department_overview() and employee_own_overview():
-- the employees table has no first_name/last_name columns -- the real
-- identifying fields are employee_code and job_title.

create or replace function manager_department_overview(dept_id uuid)
returns json
language sql
stable
as $$
  select json_build_object(
    'department', (
      select json_build_object('id', d.id, 'name', d.department_name)
      from departments d where d.id = dept_id
    ),
    'kpis', (
      select json_build_object(
        'totalEmployees', count(*),
        'avgPerformanceScore', avg(m.performance_score),
        'avgMonthlySalary', avg(m.monthly_salary),
        'avgYearsAtCompany', avg(e.years_at_company),
        'avgTrainingHours', avg(coalesce(m.training_hours_calc, m.training_hours)),
        'totalProjectsHandled', sum(m.projects_handled),
        'avgWorkHoursPerWeek', avg(coalesce(m.work_hours_per_week_calc, m.work_hours_per_week))
      )
      from employees e
      join employee_metrics m on m.employee_id = e.id
      where e.department_id = dept_id
    ),
    'workLifeBalanceDistribution', (
      select coalesce(json_object_agg(coalesce(work_life_balance, 'Unknown'), cnt), '{}'::json)
      from (
        select m.work_life_balance, count(*) as cnt
        from employees e
        join employee_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.work_life_balance
      ) t
    ),
    'performanceRatingDistribution', (
      select coalesce(json_object_agg(coalesce(pr.name, 'Unrated'), cnt), '{}'::json)
      from (
        select m.performance_rating_id, count(*) as cnt
        from employees e
        join employee_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.performance_rating_id
      ) t
      left join performance_ratings pr on pr.id = t.performance_rating_id
    ),
    'employees', (
      select coalesce(json_agg(
        json_build_object(
          'id', e.id,
          'employeeCode', e.employee_code,
          'jobTitle', e.job_title,
          'performanceScore', m.performance_score,
          'monthlySalary', m.monthly_salary,
          'yearsAtCompany', e.years_at_company
        ) order by m.performance_score desc nulls last
      ), '[]'::json)
      from employees e
      join employee_metrics m on m.employee_id = e.id
      where e.department_id = dept_id
    )
  );
$$;

grant execute on function manager_department_overview(uuid) to service_role, authenticated, anon;


create or replace function employee_own_overview(emp_id uuid)
returns json
language sql
stable
as $$
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
      from employee_metrics m
      left join performance_ratings pr on pr.id = m.performance_rating_id
      left join satisfaction_ratings sr on sr.id = m.satisfaction_rating_id
      where m.employee_id = emp_id
    )
  );
$$;

grant execute on function employee_own_overview(uuid) to service_role, authenticated, anon;
