'use strict';

App.constant('PATHS_CONFIG', {
    // This route is used in the `otherwise` clause. Since we cannot have a `otherwise`
    // route with params, we use this one on ly for that scenario and we will display
    // agencies from the default country.
    NOT_FOUND: '/not-found',

    AGENCIES: '/agencias-de-publicidad-en-:country',
    AGENCY: '/agencias-de-publicidad-en-:country/:aliasAgency/:idAgency',
    ADD_AGENCY: '/agencias-de-publicidad-en-:country/sugerir-agencia',

    LOGIN: '/login',

    REVIEWS: '/comentarios/',
    REVIEW: '/comentarios/:aliasAgency/:aliasReview/:idAgency/:idReview',
    ADD_REVIEW: '/comentarios/sumar-opinion/:aliasAgency/:idAgency',

    SALARIES: '/sueldos-en-:country',
    ADD_SALARY: '/sueldos-en-:country/ingresar-sueldo',
    AVERAGE_SALARY: '/sueldos-en-:country/comparar-sueldo/:aliasSalary/:idSalary',

    NEWS: '/foro-de-agencias-de-publicidad',
    NEWS_EXPANDED: '/foro-de-agencias-de-publicidad/:aliasNews/:idNews'
});
