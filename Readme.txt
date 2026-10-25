COS10005 Web Development - Assignment 2 (Semester 2, 2026)
CineSwin - Movie Discovery and Ticket Booking Platform
Student: Abid Us Sobhan    Student ID: s103802241

LINKS
-----
Mercury:  https://mercury.swin.edu.au/cos10005/s103802241/assignment2/index.html
GitHub:   https://github.com/Abid8195/wd-assign2

WEBSITE STRUCTURE
-----------------
assignment2/
  index.html      Home page: purpose, values, target users, services, featured movies
  movies.html     Movie listing: 11 movies with all required details; Book / Watchlist buttons
  recommend.html  Recommendation form (genre, age group, viewing preference)
  register.html   Registration form with JavaScript validation (front-end only)
  booking.html    Ticket booking form (POST to the Mercury regtest.php address)
  watchlist.html  Bonus: personal watchlist (add / view / remove)
  css/style.css   One external stylesheet linked from every page (desktop, tablet, mobile)
  js/script.js    All JavaScript, linked from every page
  images/         logo.png, hero.jpg, movie1.jpg ... movie11.jpg
  Readme.txt      This file

Every page shares the same header, navigation bar (current page highlighted with the
"current" class and aria-current="page") and footer, and uses <header>, <nav>, <main>,
<section> and <footer>.

HOW MOVIE SELECTION IS CARRIED TO THE BOOKING PAGE
--------------------------------------------------
"Book Tickets" buttons on movies.html, recommend.html, index.html and watchlist.html are
normal links such as booking.html?movie=inception. When booking.html loads, script.js reads
the query string with URLSearchParams, finds that id in the MOVIES array and selects the
matching option in the Movie dropdown. Why this approach: it needs no server, works with a
plain link, survives a page refresh and can be bookmarked. If the page is opened directly
there is no ?movie value, so the dropdown starts empty and the user picks a movie. The user
can change the movie at any time; the price and session times update immediately.

JAVASCRIPT VALIDATION LOGIC (PLAIN ENGLISH)
-------------------------------------------
Registration (register.html): the submit button never sends data anywhere. It runs one check
per field and shows a red message under every field that fails, then focuses the first bad
field. Rules: username at least 5 characters using only letters, numbers and underscores;
email must look like name@domain.xx; phone digits only, 8 to 15 long; password at least 10
characters with an uppercase letter, a lowercase letter, a number and a special character
(the message lists exactly what is missing); confirm password must equal the password; a
gender must be chosen; at least one preferred genre; a country must be chosen. Fields are
also checked when the user leaves them. A success message appears only if every check passes.

Booking (booking.html): required fields cannot be empty; email must be valid; phone needs at
least 10 digits; the screening date cannot be before today and the date plus session time
cannot be earlier than the current moment; ticket number must be a whole number greater than
0 (maximum 20). Payment: choosing Voucher shows a voucher box (12 digits) and hides the card
fields; choosing Online payment shows the card type and card number (digits only; Visa and
Mastercard 16 digits, American Express 15 digits) and hides the voucher box. Hidden payment
fields are disabled, so they are not validated or submitted. The billing email is required;
ticking "Same as email address" copies the email and keeps it in sync while the box is
ticked. If anything fails, submission is cancelled and a summary of all errors is shown;
when everything passes the form posts to the Mercury address.

Cost: total = movie price x ticket-type factor (Adult 1.0, Student 0.8, Child 0.6) x number
of tickets, recalculated whenever the movie, ticket type or quantity changes.

Recommendations (recommend.html): rule-based scoring. First a hard filter by age group
(Child: G and PG; Teen: G, PG and M; Adult: everything). Then each remaining movie scores
+5 for matching the chosen genre, +3 if it is tagged for the viewing preference (family,
date night, friends or solo), +2 for child-friendly ratings when the age group is Child,
+1 for a running time of 130 minutes or less for children or family viewings, and +1 for
animation or action titles for teens. The top three scores are shown with the reasons.
Different inputs therefore give different results (e.g. Child + Animation + Family gives
Spirited Away, Spider-Verse, Paddington 2; Adult + Crime + Friends gives Goodfellas,
The Departed, The Wolf of Wall Street).

Watchlist (bonus): the ids of saved movies are stored as a JSON array in the browser's
localStorage. Add/remove buttons update the array; watchlist.html redraws its cards from
the array, and the navigation shows a count badge. The list stays when moving between pages.

KNOWN ISSUES AND LIMITATIONS
----------------------------
- Registration and recommendations are front-end only; nothing is stored on a server.
- Session times are fixed per movie and the same every day; no seat selection.
- The watchlist uses localStorage, so it is per browser and is cleared if site data is cleared.
- Card numbers are format-checked only (length and digits); there is no Luhn check.

REFERENCES
----------
- Movie titles, directors, years and age ratings (Australian Classification) are factual
  information about the films; all movie descriptions were written by the student.
- All poster images (movie1.jpg - movie11.jpg), hero.jpg and logo.png are original
  artwork generated by the student for this project with a Python (Pillow) script. No
  third-party or copyrighted posters are used.
- Layout and form-validation techniques follow the unit's Week 2-11 workshop labs
  (HTML, CSS, regform validation, modal/tooltip scripts, XML handling).
- Fonts: system font stack (Segoe UI, Roboto, Arial). No external libraries.
- GitHub workflow: "Introduction to GitHub" guide supplied by the unit.
- MDN Web Docs (URLSearchParams, localStorage) for API reference.
