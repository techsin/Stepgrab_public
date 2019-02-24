# StepGrab

## Notes

initdb /some/directory # just do this ONCE
pg_ctl -D /some/directory start # many other options, e.g. logging, available here
psql postgres
host all postgres 127.0.0.1/32 trust

pg_ctl -D \psql_data start
createdb -h localhost -U techsin dailysos
pg_ctl -D "C:\Program Files\PostgreSQL\9.6\data" start

#mac
sudo su - postgres
psql
- or
createuser -P -s -e UBUNTU_USERNAME
exit

#windows 
psql.exe -U postgres 
createuser -P -s -e techsin
CREATE ROLE techsin PASSWORD 'md57635f1184a4fd834b8795d42d50a1ab7' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;
createdb -h localhost -U db_username MYAPPNAME_development
C:\Program Files\PostgreSQL\9.6\data hb_conf
drop table "Deals" <-- need double quotes to prevent auto lower casing>
only user that exists is postgresql, will ask password even if user doesn't exist
pg_ctl reload
host all postgres 127.0.0.1/32 trust

node_modules\.bin\sequelize db:migrate
node_modules\.bin\sequelize db:migrate:undo

to connect using psql on ssh server

psql \
   --host=aab1p0wq92141z.clyt9myvoznu.us-east-1.rds.amazonaws.com \
   --port=5432 \
   --username=techsin \
   --password \
   --dbname=ebdb 

//to log ec2 nodejs output
tail -f /var/log/nodejs/nodejs.log. I 

#regarding template 1 & 0 database.
https://blog.dbi-services.com/what-the-hell-are-these-template0-and-template1-databases-in-postgresql/


#things I learned

Sesssion save unintialized: if false, mean dont store sessions if it wasn't modified

Session resave: is needed if the databse automatically deletes some sessions if they're idle for long time. Store has to implement touch method, touch can be disabled at store to reduce db writes. sequelize does have touch method

Session secret: it is used to sign cookie that is used to save session id. If using session storage then dont need signed cookies sepreately, as signed cookies were used for storage.
secret session cookie is signed with this secret to prevent tampering
cookie session cookie settings, defaulting to { path: '/', httpOnly: true, maxAge: null } can add  {secure: true}

Signed cookies: The cookie will still be visible, but it has a signature, so it can detect if the client modified the cookie. HMAC of values+secret is saved along values in cookie. If values are changed then hash doesn't match on recalculation.

Cookie Secure: browser send cookie only over https and not http.

Http Only: helps prevent XSS attacks, by preventing javascript from being able to modify and access cookies.

salt: salt is needed because even if you hash with secure function, people use common passwords, and rainbow table can allow easily to decode original password. with salt reverse hash look up isnt possible, as you need to create hashtable for each salt.

HSTS: The HTTP Strict-Transport-Security response header (often abbreviated as HSTS)  lets a web site tell browsers that it should only be accessed using HTTPS, instead of using HTTP.
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security

Unique constraint only worked once added index with unique on model??

amazon ses: bucket should have permission, rule set should be active, rule domains should be verified, rule domain should be both .ex.com ex.com, any other rule should have domain specified otherwise email goes to previous domain catch all

beforeUpdate hook called when use instance.save() or instance.update(), when use model.update(), beforeBulkUpdate will be called

CORS : Access control, let server decided who can interact with its content, enforced by browser.. csrf still possible in non js ways
img+script tag can fetch resources from any domain
token work because sop doesn't allow doing get request to return data
attacker can make browser send all get via 'img' or href or iframe, post with form-urlenc.. or multipart/form-data or text/plain
but if there are custom headers or link (1) 
https://security.stackexchange.com/a/58308/43921 (1)
https://stackoverflow.com/questions/19793695/does-a-proper-cors-setup-prevent-xsrf
https://security.stackexchange.com/questions/8264/why-is-the-same-origin-policy-so-important
https://security.stackexchange.com/questions/43639/why-is-the-access-control-allow-origin-header-necessary
https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet
https://scotthelme.co.uk/csrf-is-dead/
https://stackoverflow.com/questions/10636611/how-does-access-control-allow-origin-header-work

CSP: prevents xss attacks by limiting what your website can load and run, ie. no inline script
https://security.stackexchange.com/questions/131149/what-are-the-limitations-of-content-security-policy

ipconfig /flushdns
sudo killall -HUP mDNSResponder
chrome://net-internals/#dns
chrome://net-internals/#sockets

sequelize join table attributes can be passed at time of adding customer.addDeal(deal, {through: {expiresAt: ....}})

babel presets
https://jaketrent.com/post/simplify-babel-setup-with-babel-preset-env/
https://stackoverflow.com/questions/37251552/whats-the-difference-between-babel-preset-stage-0-babel-preset-stage-1-etc
https://babeljs.io/docs/plugins/preset-react/
https://github.com/zeit/next.js/issues/2468

#things to do
implement payment/stripe
delete unverified customers in 1 hour.
add resend button
disable iframing xframe options

validate address on backend (OMG it's deep hole)
implement recaptcha js backend
add server side validation for inputs on discount
add error to discount page
unique: true is breaking sync
implement CSRF token
implement CORS access control
Bruteforce protection login and registration
checkout nexmo for sms messaging.
extract out deleting tokens to cron jobs
add change phone number button for customer
add date coupon was used at

#things done
remove data: from csp - problem with leaflet
implement redo logic for codes https://github.com/sequelize/sequelize/issues/9263
add redeem option on desktop version of dashboard for businesses
add code to deals
don't show deals used in map view
implement CSP
Sanitaize user input on registration and login
add auto fill on error for registration and login
xss escaping
build settings page
Sanitaize customer input

#things to think about

user should be able to filter further : fashion > men
user should be able to view their active deals
biz should be able to look up code manually
rel=”alternate” and rel=”canonical”
180/.2 = 900
360/.2 = 1800

Map tiles
720 x 360

world coordinate = 0 - 256 x,y
pixel coordinate = worldCoords * 2^zoomelevel
tile number  = pixelCoords / 256