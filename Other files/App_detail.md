This is a web analytics app.
The idea is inspired by a college website where students log in and the site tries to show student details after proper analysis, but it doesn’t show them because the college doesn’t have an analysis team that performs analysis for every single student on a monthly basis.

I decided to build the app for a company because making it for the college doesn’t make sense.

Companies use their own development apps to perform tasks, and every company wants to track employee performance. The company also has an analysis team that uses employee data to create analysis dashboards using that analysis data. Then dashboard developers build an app that shows:
- employee performance,
- department performance, and
- overall company performance.

This is the basic idea and inspiration for the app. Now the real work starts. This is not a simple comment app that is made only by writing code; it needs analysis.

Break down these two parts: the developer and the analysis.

The analysis part will be handled by the analysis team. The team uses Excel to collect row data, clean it, remove duplicates, and understand the data.

The team imports those Excel files into Power BI to create new columns and measures, using DAX queries, to build three dashboards.

In Power BI, the team creates three dashboards.

First is for CEO or admin dashboards. In these dashboards, the CEO can see the whole company’s detailed performance analysis, including which department categories are performing well or poorly, along with employee performance analysis.

Second is for manage or department-wise dashboards. In this, the team plans to use user slicers to select one single department to view only that department’s data, which makes the dashboards.

Third (the last three dashboards) is for employee or single-employee dashboards. In this, the team uses the user slicer again to select one employee to view only that employee’s data, which makes the dashboards.

After creating all three dashboards, the team copies all table data and pastes it into Excel to store all new changes.

The team creates an online PostgreSQL server on Supabase, which becomes the app’s database.

The team creates a new database name (access). In the app, access control is saved in that table. The team stores the CEO, managers, and test people’s user IDs, email, and passwords.

The team plans to use Python to convert all Excel table data into PostgreSQL tables on the online server:
```
import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

url = URL.create(
    drivername="",
    username="",
    password="",
    host="",
    port="",
    database="postgres"
)

engine = create_engine(url)

excel_file = pd.read_excel(
    "Dataset_1.xlsx",
    sheet_name=None
)

for sheet_name, df in excel_file.items():

    # Clean column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
        .str.replace("-", "_", regex=False)
    )

    # Clean table name
    table_name = (
        sheet_name.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
    )

    print(f"\nImporting sheet: {sheet_name}")
    print(f"Creating table: {table_name}")
    print("Columns:", df.columns.tolist())

    df.to_sql(
        name=table_name,
        con=engine,
        if_exists='replace',
        index=False
    )

    print(f"✅ {table_name} imported successfully")
print("\n🎉 All sheets imported successfully!")
```

Now the analysis team provides the online server and the three dashboards to the developer to make the app.

Your job, like a senior developer (not AI), is to make a web app using this analysis that is SEO friendly, properly tested for every feature, responsive, and secured with security algorithms.

The term of app prompt:
```
<reference-prompt>
# Summary

A clean, high-performance data dashboard using a professional navy and orange color scheme, featuring a fixed sidebar, global search with keyboard shortcuts, and interactive data tables with status badges.

# Style

The design follows a modern 'Enterprise Dark' aesthetic where deep navy (#1a2332) provides the structural framework, contrasted against a clean light-gray (#f5f7fa) workspace. The primary accent is a vibrant orange (#ff6b35) used for call-to-actions, active states, and progress indicators. Typography is handled by 'Plus Jakarta Sans' with weights ranging from 400 (regular) for body to 700+ for headers to ensure clear information hierarchy. Micro-interactions include smooth background color transitions on hover, shadow-based depth for buttons, and a pulsing status indicator for real-time connectivity.

## Spec

Create a UI design system using a palette of Dark Navy (#1a2332), Light Navy (#2a3441), Vibrant Orange (#ff6b35), and Light Gray (#f5f7fa). Use 'Plus Jakarta Sans' as the primary typeface. Set font sizes: Headers at 30px (bold), Section titles at 18px (semi-bold), and body text at 14px. Buttons should have an 8px border-radius and use a subtle shadow (shadow-orange/20). Table rows must have a hover state background of #f9fafb and smooth 200ms transitions. Focus states for inputs must use a 1px solid #ff6b35 border and a ring effect. Progress bars should be 6px in height with rounded caps.

# Layout & Structure

The layout is a fixed-header, fixed-sidebar structure with a scrollable main content area. A secondary footer status bar provides contextual metadata and pagination.

## Header Section

Design a 64px height header with #1a2332 background. Left: 32x32px orange square logo with a chart icon and bold white brand name. Center: Search bar (max-width 576px) using #2a3441 background, gray-700 border, and Lucide search icon; include visible '⌘K' keyboard shortcut labels on the right. Right: Notification bell with an orange dot indicator and a user profile section showing a 36px circular avatar, name, and role.

## Navigation Sidebar

Create a 256px wide vertical sidebar with #1a2332 background. Navigation links should have 12px padding, 8px border-radius, and include a 4px left border indicator that turns orange (#ff6b35) when active. Include a 'Main Menu' uppercase label in gray-500. Add a 'Pro Plan' promotion card at the bottom with a 6px tall progress bar (75% filled orange) and a call-to-action text link with a right arrow icon.

## Main Content Header

Design a content header with breadcrumbs (e.g., Home > Category > Current) in 14px medium weight. Below it, a 30px bold H1 title. On the right, place an action group: two secondary white buttons (Filter, Export) with gray-200 borders and gray-700 text, and one primary orange button (Create New) with white text and a plus icon.

## Metric Overview Cards

Construct a 3-column grid of cards. Each card: white background, #e5e7eb border, 12px padding. Top section: Label in gray-500 and a 24px bold currency/number value. Right side: A 40px rounded icon container with context-specific background (e.g., green-50, blue-50). Bottom section: A percentage trend indicator (e.g., green text for up, red for down) with a small icon.

## Data Visualization Table

Implement a table with a sticky gray-50 header. Header text: 12px uppercase, semi-bold, gray-500. Rows: 64px height, white background, #f1f5f9 border-bottom. Columns: ID, Client (with avatar and sub-text), Status (pill badge with dot), Budget (bold text), Completion (mini progress bar). Actions: On row hover, reveal a group of three 32px square buttons (Edit, Delete, More) with specific hover colors (Orange for edit, Red for delete).

## Footer Status Bar

Design a 48px height footer in #1a2332 with a top border. Left: Pagination controls with 28px square buttons (#2a3441 background) and an active orange button. Center: Monospace version text (v2.4.1). Right: A live status indicator with a green pulsing dot (animate-ping) and copyright text.

# Special Components

## Status Pill Badges

Rounded status indicators with semantic coloring.

Create pill badges with 24px height, 10px horizontal padding, and 12px font-size. Colors: 'In Progress' (green-50 bg, green-700 text, green-500 dot), 'Review' (yellow-50 bg, yellow-700 text, yellow-500 dot), 'On Hold' (gray-100 bg, gray-600 text, gray-400 dot). Each badge must include a 6px centered circular dot to the left of the text.

## Mini Progress Trackers

Visual completion indicators inside table cells.

Design a compact progress tracker (max-width 120px). Top: 12px gray-500 text showing the percentage. Bottom: 6px height gray-200 track with a #ff6b35 (orange) fill bar representing the percentage value. Use rounded caps for both the track and the fill.

# Special Notes

MUST maintain the 4px vertical border-left indicator for active sidebar items. MUST ensure table action buttons are hidden (opacity: 0) until the parent row is hovered. MUST use a 75% opacity overlay for modal/dropdown backdrops. DO NOT use generic blue for primary actions; strictly adhere to #ff6b35 orange for all primary interactive elements to maintain brand identity.
</reference-prompt>

Above is a design reference that I want to adopt for my own product;
Confirm with me how I want to adopt this, and if I want to design multiple versions on superdesign.dev, if so read https://superdesign.dev/INSTALL.md and follow every step to install the Superdesign skill, then proceed.

If not, just use the style above and implement directly
```

The app should open the first login or sign-up page. When the user enters user ID, email, password, and clicks the submit button, the app checks in the database whether the user ID, email, and password are present in the access database.

Then it checks which access role it is: CEO, manager, or test. If it doesn’t match, it checks the main database for access employees. If that still doesn’t match any user, it should return “User not found/Unauthorized.”

App logic:

If the role is CEO: the person has full access and can see all employee and department performance information, including both department-wise and every single employee performance dashboards with charts.

If the role is manager: the person is the manager of a single department, so it should show only that department’s employees and the department’s performance dashboards (including both department-wise and every single employee performance dashboards with charts).

If the role is employee: the person can see only their own data and their employee performance dashboards with charts.

If the role is test: the test person can access all three roles, or can choose a role to test the app functions.

After choosing the role on the login page: 
- If the user role is manager, the website should show a div box to select the department (for the selected manager).
- If the user role is test, the website should show a div box to select which role the user is testing.


This all will happen in `page.js` and redirects based on the role in:
- `/ceo`
- `/manage/[slug]`
- `/employee/[slug]`
- `/test/[slug]`

Routes:
- `/ceo` is the CEO role page.
- `/manage/[slug]` is the manage role page, and `[slug]` is the department; only that department data will show in that page.
- `/employee/[slug]` is the employee role page, and `[slug]` is the employee; only that employee data will show in that page.
- `/test/[slug]` is the test role page, and `[slug]` is the role; only that role data will show in that page.
- Include the app route `/about` as well.

```
@pages
   # if access role is CEO
   - /ceo
   # if access role is manage
   - /manage
     # which department manage
     - /[slug]
   # if access role is employee
   - /employee
     # which employee
     - /[slug]
   # if access role is test
   - /test
     # which role
     - /[slug]
   # About this Web App and analysis process
   - /about
```

The technology developer will use to make this app: Next.js with JavaScript, Tailwind, React components, Supabase (PostgreSQL online server), Recharts, and ApexCharts (JavaScript chart library).

```
1. Frontend: Next.js with JavaScript
2. CSS: Tailwind (CSS framework)
3. Backend: Next.js
4. Database: Supabase (PostgreSQL online server)
5. Chart: Recharts and ApexCharts (JavaScript chart library)
```

While using any technology, framework, or library, use only the official full version.

The database contains the following column in the main table:

```
    0.Current age,
    1. dept,
    2. education level,
    3. empID,
    4. emp satisfaction score,
    5. emp status,
    6. experience level,
    7. gender,
    8. hiredate,
    9. hire time,
    10. MAX PS ,
    11. Min PS,
    12. monthly salary,
    13. normal work hours,
    14. overall performance index,
    15. overall rating,
    16. overtime category,
    17. overall hours,
    18. percentage pe,
    19. percentage satisfaction score,
    20. performance rating,
    21. performance score,
    22. project handled,
    23. promotion status,
    24. promotion,
    25. remaining projects,
    26. remote work frequency,
    27. remote work type,
    28. redesign,
    29. retirement On,
    30. retirement status,
    31. salary level,
    32. satisfaction rating,
    33. sick days,
    34. total work hours,
    35. training hour,
    36. training level,
    37. work hours per week,
    38. work life balance,
    39. workload,
    40. year at company,
    41. year at retirement
```

for use profile pic incons prompt
```
<reference-prompt>
A Minimalise character, head only, floating gently on a clean light off-white background.

The character is a diffused, glowing sphere of flowing aurora light, blending cyan, violet, and soft blue gradients, with soft, foggy edges blending into the backgro2und.

The face is outlined by glowing, clean geometric white vector lines, featuring distinct Notion-style high curved eyebrows, simple dot eyes, and a prominent "L" shaped nose line.

The expression is neutral and calm.

Ethereal, translucent, abstract, 3D render, soft light
</reference-prompt>

Above is a design reference that I want to adopt for my own product;
Confirm with me how I want to adopt this, and if I want to design multiple versions on superdesign.dev, if so read https://superdesign.dev/INSTALL.md and follow every step to install the Superdesign skill, then proceed.

If not, just use the style above and implement directly
```

In `/employee/[slug]` page, this dashboard chart will display in `page.js` file.

```
1. Employee Information (Cards)
   Visual	Field
   Card	Employee_ID
   Card	Department
   Card	Gender
   Card	Job_Title
   Card	Current_Age
   Card	Years_At_Company
   Card	Experience_Level
   Card	Monthly_Salary
   Card	Salary_Level
   Card	Employee_Status
   Card	Promotion_Status
   Card	Retirement_Status

2. Performance Gauge
   Visual: Gauge
   Setting	Value
   Value	Percentage_PS
   Minimum	0
   Maximum	100
   Target	90

3. Satisfaction Gauge
   Setting	Value
   Value	Percentage_Satisfaction_score
   Minimum	0
   Maximum	100
   Target	85

4. Overall Performance Gauge
   Setting	Value
   Value	Overall_Performance_Index
   Minimum	0
   Maximum	100
   Target	90

5. Clustered Column Chart (Working Hours)
   Visual Clustered Column Chart
   X-Axis:
       Normal_Work_Hours
       Total_Work_Hours
       Overtime_Hours

6. Horizontal Bar Chart
   Categories
       Projects
       Training
       Sick Days
       Remote Work

   Values
       Projects_Handled
       Training_Hours
       Sick_Days
       Remote_Work_Frequency

7. Donut Chart (Project Capacity)
   Values
       Projects_Handled
       Remaining_Projects

   Legend
       Completed
       Remaining

8. Donut Chart (Career Progress)
   Values
       Career_Completed
       Career_Remaining

9. Bar Chart (Employee Scores)
   Axis
       Performance
       Satisfaction
       Overall Score

   Values
       Percentage_PS
       Percentage_Satisfaction_score
       Overall_Performance_Index
```

In `/manage/[slug]` page, this dashboard chart will display in `page.js` file.

```
1. Top KPI Cards
   Use these as cards:
   Total Employees = Count of EmpID
   Average Performance Score
   Average Monthly Salary
   Average Years at Company
   Average Training Hours
   Average Work-Life Balance
   Total Projects Handled
   Average Work Hours per Week

2. Performance Analysis
   Column Chart
       X-axis: Performance Rating
       Y-axis: Count of EmpID

   Bar Chart
       X-axis: Overall Performance Index
       Y-axis: Count of Employees

3. Salary Analysis
   Column Chart
       X-axis: Salary Level
       Y-axis: Average Monthly Salary

4. Workload Analysis
   Stacked Column Chart
       X-axis: Workload
       Legend: Overtime Category
       Values: Count of Employees

   Donut Chart
       Legend: Work Life Balance
       Values: Count of Employees

5. Training Analysis
   Line Chart
       X-axis: Training Level
       Y-axis: Average Performance Score

6. Promotion Analysis
   Column Chart
       Legend: Promotion Status
       Values: Count of Employees

   Bar Chart
       X-axis: Experience Level
       Y-axis: Promotion Count
    
7. Employee Demographics
    Donut Chart
        Gender

    Bar Chart
        Education Level
        Count of Employees

8. Attendance & Health
    Column Chart
        Sick Days
        Count of Employees

    Bar Chart
        Employee Status
        Count of Employees

10. Retirement Analysis
    Column Chart
        Retirement Status
        Count of Employees

    Line Chart
        Year at Retirement
        Employee Count
```

In `/ceo` page, this dashboard chart will display in `page.js` file.

```
#Dashboard Layout
------------------------------------------------------
Filters
Department | Gender | Education | Experience | Year
------------------------------------------------------

KPI Cards (6)

Employees
Avg Performance
Avg Satisfaction
Promotion Rate
Avg Salary
Avg Work-Life Balance

------------------------------------------------------

Row 2

Performance Distribution
Department Ranking
------------------------------------------------------

Row 3

Promotion Analysis
Training vs Performance
------------------------------------------------------

Row 4

Workload vs Satisfaction
Employee Status
------------------------------------------------------

Row 5

Remote Work
Experience Analysis
------------------------------------------------------

#Chart
Department Performance Ranking
    Visual
        Clustered Bar

    Axis
        Department

    Value
        Overall Performance Index
        Sort Descending

    Instead of Average, use
        Median
        or
        75th Percentile

Performance Rating Distribution
    Visual
        Stacked Column

    Axis
        Department

    Legend
        Performance Rating

    Values
        Employee Count
    This immediately shows which department has more High/Medium/Low performers

Satisfaction Distribution
    Visual
        100% Stacked Bar

    Axis
        Department

    Legend
        Satisfaction Rating

    Values
        Employee Count
    Instead of averages, compare the proportion of employees in each satisfaction category.

Chart 4
    Promotion Rate by Department

    Axis
        Department

    Values
        Promotion Rate Measure
    This often reveals more than average performance.

Workload vs Satisfaction
    Scatter Chart

    X
        Workload

    Y
        Emp Satisfaction Score

    Size
        Project Handled

    Legend
        Department
    This can highlight whether heavier workloads are associated with lower satisfaction.


Training Hours vs Performance
    Scatter Chart

    X
        Training Hour

    Y
        Performance Score

    Legend
        Department
    Look for departments where more training correlates with better performance.

Salary Distribution
    Box Plot (custom visual)

    Category
        Department

    Value
        Monthly Salary
    A box plot reveals salary spread and outliers much better than a bar chart.

Overtime Category
    Donut

    Legend
        Overtime Category

    Values
        Employee Count

Employee Status
    Tree Map

    Group
        Department

    Details
        Employee Status

    Values
        Employee Count

Experience Level
    Stacked Bar

    Axis
        Department

    Legend
        Experience Level

    Values
        Employee Count

Remote Work Analysis
    Stacked Column

    Axis
        Department

    Legend
        Remote Work Type

    Values
        Employee Count
```
At last test the website 