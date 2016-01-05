'use strict';

// (andres): The templates that don't have a ogData or seoData don't belong to a specific route,
// but a direcive or a partial

App.constant('TEMPLATES_URLS', {
    'salaries': {
      url: 'views/common/salaries/salaries.html',
      ogData: {
        title: 'Ranking de sueldos de agencias de publicidad – AdverView',
        description: 'Compará los sueldos en agencias de publicidad, marketing o comunicación en AdverView, el ranking de agencias.',
        image: 'images/logo.png'
      },
      seoData: {
        title: 'Ranking de sueldos de agencias de publicidad – AdverView',
        description: 'Compará los sueldos en agencias de publicidad, marketing o comunicación en AdverView, el ranking de agencias.',
      }
    },
    'news': {
      url: 'views/common/news/news.html',
      ogData: {
        title: 'Sumate a AdverView {COUNTRY}, la comunidad de la industria publicitaria',
        description: 'Todo sobre {NEWS_CATEGORIES} escrito por quienes trabajamos en publicidad',
        image: 'images/logo.png'
      },
      seoData: {
        title: 'Sumate a AdverView {COUNTRY}, la comunidad de la industria publicitaria',
        description: 'Todo sobre {NEWS_CATEGORIES} escrito por quienes trabajamos en publicidad'
      }
    },
    'news-expanded': {
      url: 'views/common/news/expanded.html',
      ogData: {
        title: '{NEWS_TITLE} - AdverView',
        description: '{NEWS_SHORT}',
        image: 'images/logo.png'
      },
      seoData: {
        title: '{NEWS_TITLE}– AdverView',
        description: 'Agencias en AdverView'
      }
    },
    'agencies': {
      url: 'views/common/agencies/agencies.html',
      ogData: {
        title: 'Todas las agencias de comunicación, publicidad y marketing en AdverView, Ranking de Agencia',
        description: '¿Cómo es trabajar en Grey, Ogilvy, BBDO, Publicis,R/GA, Wunderman o JWT? Estas y otras agencias en AdverView, Ranking de Agencias.',
        image: 'images/logo.png'
      },
      seoData: {
        title: 'Todas las agencias de comunicación, publicidad y marketing en AdverView, Ranking de Agencia',
        description: '¿Cómo es trabajar en Grey, Ogilvy, BBDO, Publicis,R/GA, Wunderman o JWT? Estas y otras agencias en AdverView, Ranking de Agencias.'
      }
    },
    'add-agency': {
      url: 'views/common/agencies/add.html',
      ogData: {
        title: 'Todas las agencias de comunicación, publicidad y marekting en AdverView, Ranking de Agencias',
        description: 'Enterate lo que opinan quienes trabajan en Young&Rubicam, Ogilvy, BBDO, Publicis,R/GA, Publicis, Wunderman, JWT, en AdverView.',
        image: 'images/logo.png'
      },
      seoData: {
        title: 'Todas las agencias de comunicación, publicidad y marekting en AdverView, Ranking de Agencias',
        description: 'Enterate lo que opinan quienes trabajan en Young&Rubicam, Ogilvy, BBDO, Publicis,R/GA, Publicis, Wunderman, JWT, en AdverView.'
      }
    },
    'add-salary': {
      url: 'views/common/salaries/add.html',
      ogData: {
        title: '¿Cuáles son los sueldos de agencias de publicidad, marketing y comunicación?',
        description: 'Compará tu sueldo y enterate cuanto deberías estar ganando en AdverView {COUNTRY}, el ranking de agencias de publicidad, marketing y comunicación.',
        image: 'images/logo.png'
      },
      seoData: {
        title: '¿Cuáles son los sueldos de agencias de publicidad, marketing y comunicación?',
        description: 'Compará tu sueldo y enterate cuanto deberías estar ganando en AdverView {COUNTRY}, el ranking de agencias de publicidad, marketing y comunicación.'
      }
    },
    'average-salary': {
      url: 'views/common/salaries/average.html',
      ogData: {
        title: '¿Cuál es el sueldo de un {JOB_POSITION} {SENIORITY}? – Ranking de Agencias',
        description: 'Compará los sueldos en agencias de publicidad, marketing o comunicación para un {JOB_POSITION} en AdverView, el ranking de agencias',
        image: 'images/logo.png'
      },
      seoData: {
        title: '¿Cuál es el sueldo de un {JOB_POSITION} {SENIORITY}? – Ranking de Agencias',
        description: 'Compará los sueldos en agencias de publicidad, marketing o comunicación para un {JOB_POSITION} en AdverView, el ranking de agencias'
      }
    },
    'agency': {
      url: 'views/common/agencies/details.html',
      ogData: {
        title: '¿Cómo es trabajar en {AGENCY_NAME}? – Ranking de Agencias',
        description: '', //sent by the backend
        image: '',
        url: ''
      },
      seoData: {
        title: '¿Cómo es trabajar en {AGENCY_NAME}? – Ranking de Agencias',
        description: '' //sent by the backend
      }
    },
    'reviews': {
      url: 'views/common/reviews/reviews.html',
      ogData: {
        title: '¿Cuál es la mejor agencia para trabajar en {COUNTRY}? - AdverView',
        description: 'Entrá al ranking, mirá los comentarios y dejá tu opinión en AdverView, ranking de agencias.',
        image: 'images/logo.png'
      },
      seoData: {
        title: '¿Cuál es la mejor agencia para trabajar en {COUNTRY}? - AdverView',
        description: 'Entrá al ranking, mirá los comentarios y dejá tu opinión en AdverView, ranking de agencias.'
      }
    },
    'add-review': {
      url: 'views/common/reviews/add.html',
      ogData: {
        title: '¿Trabajaste alguna vez en {AGENCY_NAME}? - Dejá tu opinión en AdverView',
        description: '¿Trabajás en publicidad, comunicación o marketing? Compartí tu opinión en Adverview {COUNTRY}, Ranking de Agencias.',
        image: 'images/logo.png'
      },
      seoData: {
        title: '¿Trabajaste alguna vez en {AGENCY_NAME}? - Dejá tu opinión en AdverView',
        description: '¿Trabajás en publicidad, comunicación o marketing? Compartí tu opinión en Adverview {COUNTRY}, Ranking de Agencias.'
      }
    },
    'reviews-details': {
      url: 'views/common/reviews/details.html',
      ogData: {
        title: '¿Cómo es trabajar como {JOB_POSITION} en {AGENCY_NAME}? - AdverView',
        description: '{REVIEW_TITLE} - {REVIEW_SHORT}',
        image: 'images/logo.png'
      },
      seoData: {
        title: '¿Cómo es trabajar como {JOB_POSITION} en {AGENCY_NAME}? - AdverView',
        description: '{REVIEW_TITLE} - {REVIEW_SHORT}'
      }
    },
    'agencies-rankings': {
      url: 'views/common/agencies/agencies-rankings.html'
    },
    'agencies-list': {
      url: 'views/common/agencies/agencies-list.html'
    },
    'progress-radial': {
      url: 'views/common/directives/progress-radial.html'
    },
    'select-list': {
      url: 'views/common/directives/select-list.html'
    },
    'agency-details': {
      url: 'views/common/directives/agency-details-block.html'
    },
    'salary-details': {
      url: 'views/common/directives/salary-details-block.html'
    },
    'main': {
      url: 'views/common/main.html'
    },
    'review-details': {
      url: 'views/common/directives/review-details-block.html'
    },
    'main-header': {
      url: 'views/common/directives/main-header.html'
    },
    'load-more-content': {
      url: 'views/common/directives/load-more-content.html'
    },
    'dialog': {
      url: 'views/common/directives/dialog.html'
    },
    'likes': {
      url: 'views/common/directives/likes.html'
    },
    'login': {
      url: 'views/common/authentication/login.html'
    },
    'notification': {
      url: 'views/common/directives/notification.html'
    },
    'menu': {
      url: 'views/common/directives/menu.html'
    },
    'screen-loader': {
      url: 'views/common/directives/screen-loader.html'
    },
    'input-control': {
      url: 'views/common/directives/input-control.html'
    },
    'radio-control': {
      url: 'views/common/directives/radio-control.html'
    },
    'select-control': {
      url: 'views/common/directives/select-control.html'
    },
    'submit-control': {
      url: 'views/common/directives/submit-control.html'
    },
    'slider-control': {
      url: 'views/common/directives/slider-control.html'
    },
    'checkbox-control': {
      url: 'views/common/directives/checkbox-control.html'
    },
    'comments': {
      url: 'views/common/directives/comments.html'
    },
    'navbar': {
      url: 'views/common/directives/navbar.html'
    }
});
