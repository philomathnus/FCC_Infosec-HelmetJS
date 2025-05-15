const express = require('express');
const helmet = require('helmet');

const app = express();
// remove powered-by header which tells that the app is Express based, allowing for exploits
app.use(helmet.hidePoweredBy());
// deny anyone from entering a <frame> or <iframe> to the page in order to mitigate clickjacking
// (hacker putting an unseen frame layer which allow to enable bad scripts to be ran)
app.use(helmet.frameguard({ action: 'deny' }));
// Mitigate the Risk of Cross Site Scripting (XSS) Attacks 
// ( malicious scripts are injected into vulnerable pages, with the purpose of stealing sensitive data like session cookies, or passwords.)
// always sanitize user input - Sanitizing means that you should find and encode the characters that may be dangerous e.g. <, >.
app.use(helmet.xssFilter());
// Avoid Inferring the Response MIME Type with helmet.noSniff() - instructing the browser to not bypass the provided Content-Type
app.use(helmet.noSniff());
// Prevent IE from Opening Untrusted HTML with helmet.ieNoOpen().
// This middleware sets the X-Download-Options header to noopen which prevents IE users from executing downloads in the trusted site's context.
app.use(helmet.ieNoOpen());
// Ask Browsers to Access Your Site via HTTPS Only with helmet.hsts().
// HTTPS protects websites against protocol downgrade attacks and cookie hijacking.
// Ask user’s browsers to avoid using insecure HTTP. This will work for the requests coming after the initial request.
// NOTE: Configuring HTTPS on a custom website requires the acquisition of a domain, and an SSL/TLS Certificate.
const timeInSeconds = ninetyDaysInSeconds = 90 * 24 * 60 * 60;
app.use(helmet.hsts({ maxAge: timeInSeconds, force: true })); // enforce for the next 90 days
// Disable DNS Prefetching. To improve performance, most browsers prefetch DNS records for the links in a page.
// his may lead to over-use of the DNS service (if you own a big website, visited by millions people…), 
// privacy issues (one eavesdropper could infer that you are on a certain page), 
// or page statistics alteration (some links may appear visited even if they are not).
// disable with cost of a performance penalty!!
app.use(helmet.dnsPrefetchControl());
// (try ) to disable Client-Side Caching with helmet.noCache() -> performance penalty!
app.use(helmet.noCache());
// Set a Content Security Policy. By setting and configuring a Content Security Policy you can prevent the injection of anything unintended into your page 
// (i.e XSS vulnerabilities, undesired tracking, malicious frames and more).
// CSP works by defining an allowed list of content sources which are trusted. 
// By default, directives are wide open, so it’s important to set the defaultSrc directive as a fallback (applies for most of the unspecified directives).
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com']
    }
  }));

// app.use(helmet()) will automatically include all the middleware introduced above, except noCache(), 
// and contentSecurityPolicy(), but these can be enabled if necessary. 
/* 
app.use(
  helmet({
    frameguard: {         // configure
      action: 'deny'
    },
    contentSecurityPolicy: {    // enable and configure
      directives: {
        defaultSrc: ["'self'"], F
      styleSrc: ['style.com'],
      }
    },
    dnsPrefetchControl: false     // disable
  }))
 */

















































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
