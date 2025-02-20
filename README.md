# Roadmap
---
## Mvp
- [x] Analyze cv
- [x] Basic interview
- [x] Generate questions based on cv
- [x] Evaluate answers
- [x] Feedback at the end of the interview
- [x] Voice mode
    - [x] Text to speech
    - [x] Free text to speech
    - [x] Simple speech to text
- [x] Save the interview at the end
    - [x] All messages
    - [x] Date
    - [x] Summary and grade seperately
- [x] Only one user for now, so we only need to store 1 interview history
- [x] Display interview history (home page)
- [x] Can look at previous interviews
- [x] Can delete previous interviews
- [ ] Bugs
    - [x] When deleting an interview, the page is not refreshed
    - [ ] When inapropriate message is sent, we wait for the evaluation to be done before sending the next message
    - [ ] When the interview is over, we wait for all messages to be evaluated before showing the results
    - [ ] Only saves the first few messages
    - [x] Routes 
    - [ ] Generate questions based on the cv again
    - [ ] Error if llama isn't started
    - [ ] Can multiple users use it at the same time?
    - [ ] AuthContext slows the app down?
    - [ ] Technologies used for projects in cv
    - [ ] When user enters the site and is still logged in, extend the jwt token (generate a new one, that lasts longer, basically login again, idk if this is possible)
    - [ ] Projects are registered as work experience too
    - [ ] Hash passwords
    - [ ] Navigate after registration & login
    - [x] The user can start the interview without uploading a cv
    - [ ] After logging in, the cv upload page is shown again
    - [ ] The user can see the password by clicking on the eye icon
---
## Next steps

- [x] Authentication & Authorization
- [x] Database models & use of database
    - [x] User
    - [x] CV
    - [x] Interview
    - [x] Save cv for user
    - [x] Save interviews for user
- [x] Router on front-end
- [x] Protected routes
- [x] CV page
    - [x] Display the cv analysis
    - [x] Can change cv info on the front-end
    - [x] Can change cv by chaning the info
    - [x] Can upload a new cv, and the old one is updated
- [x] Interview stats
    - [x] Stats page
    - [x] Average grade, lowest, highest, median
    - [x] Display a graph with the interview history grades
- [x] JWT token context 
- [x] CV uploaded context
- [x] Settings page
    - [x] Change email
    - [x] Change password
    - [x] Change theme
    - [ ] Change voice of the interviewer
    - [x] Delete account
    - [x] Logout
- [ ] Simulation & Training mode
    - [ ] Can select the type of interview 
    - [ ] Different prompts for different types of interviews

- [ ] Voice mode for the interview
    - [ ] Visual feedback for voice waves
- [ ] Better voice for ai
- [ ] Better ui & ux
- [ ] Dark & light mode
- [ ] Messages when uploading cv
- [ ] Messages when generating questions
- [ ] Messages when evaluating answers
- [ ] Notifications
- [ ] Loading page
- [ ] Error page
- [ ] Responsive design
- [ ] Cleaner code
- [ ] Deployment

## More features
- [ ] AI coach
    - [ ] AI coach based on the interview history
    - [ ] AI coach based on the cv
- [ ] Send email
- [ ] More natural voices for the ai


