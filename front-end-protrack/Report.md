# Report

## I. Login

1. Employee is redirected to Login Page by default.

   **Login Page:** Login Page has two input fields:
   
   a. Employee Code.
   
   b. Password.
   
   On entering valid credentials employee is authenticated and navigated to dashboard panel.
   
   On entering invalid credentials employee is alerted with error on the screen.

   image.png

## II. Dashboard Panel

1. Employee is redirected to Dashboard Panel on successful Login of the Employee.

   Dashboard Panel comprises of a side nav which has following buttons.
   
   a. **Dashboard:** Gives brief summary of Total Time Tracked, Idle Minutes, Unproductive time, Productive Time, Manual Time (for today, yesterday, Past 7 Days, Past 30 Days)
   
   b. **Attendance:** Employee can mark his/her attendance by punching in for the day by clicking the Start Day Button.
   
      On Clicking the start Day button timer also starts running which is displayed on the screen and employee live record for the punched in time.
      
      Employee can end their day/punch out by clicking the End Day button.
      
      On punching out the live timer (started on punching in) also stops.
      
      Below the Attendance buttons (start/end day) a brief summary of employees punchIn and punchOut and Projects worked on that is displayed on the form of table.
   
   c. **Timesheet**
   
   d. **Report**
   
      i. Attendance Details
      
      ii. Hours Tracked
      
      iii. Timeline
      
      iv. Employee Logs
   
   e. **Projects**
   
      i. Project List
      
      ii. Employee
      
      iii. Task Progress
      
      iv. Timesheet
   
   f. **Team**

## III. Logout

On clicking the Logout button employee is prompted to fill his/her timesheet.

These are the fields in the timesheet:

1. Activity Description (Text)

2. Time in minutes (Float)

3. Activity (To be selected from dropdown list which is populated from the database).

Employee can create and enter more activities and delete according to their need.

OnClicking save button the activities are to posted (save) in the database.
