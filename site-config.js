// The one switch for self-service signup on this site.
//
// While `signupEnabled` is false every "Start free trial" link stays hidden and the "Coming soon" wording stays
// up. Setting it to true shows the links, which send visitors to the lobby's /register page. Turn it on together
// with the Studio deployment's `signupEnabled` stack setting (Cratis/Studio, Documentation/deployment/lobby.md):
// the site only links to the page, it is the lobby that opens or closes registration.
window.CRATIS_STUDIO = {
    signupEnabled: false,
    signupUrl: 'https://lobby.cratis.studio/register?utm_source=cratis.studio&utm_medium=website&utm_campaign=trial',
};
