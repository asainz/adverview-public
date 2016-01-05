'use strict';

App.service('COPY', function(LENGTH_CONFIG){
    var ERROR_MESSAGES = {
        default: {
            required: '',
            maxlength: '',
            minlength: '',
            pattern: '',
            minWords: ''
        },
        title: {
            required: '',
            maxlength: '',
            minlength: ''
        },
        description: {
            required: '',
            minWords: '',
            maxlength: ''
        },
        overallScore: {
            pattern: ''
        },
        currentlyEmployed: {
            required: ''
        },
        currentJobPosition: {
            required: ''
        },
        currentSeniority: {
            required: ''
        },
        agencyName:{
            required: '',
            pattern: '',
            maxlength: '',
            minlength: ''
        },
        web:{
            required: '',
            pattern: ''
        },
        type:{
            required: ''
        },
        reviewComment:{
            required: '',
            minWords: '',
            maxlength: ''
        },
        salary: {
            pattern: '',
            required: '',
            minlength: '',
            maxlength: ''
        },
        currency: {
            required: ''
        }
    };

    var FORM_LABELS = {
        CURRENTLY_EMPLOYED: '',
        CURRENT_SENIORITY: '',
        CURRENT_JOB_POSITION: '',
        AGENCY_NAME: '',
        AGENCY_WEB: '',
        SUBMIT_AGENCY: '',
        SUBMIT_REVIEW: '',
        REVIEW_TITLE: '',
        REVIEW_TITLE_PLACEHOLDER: '',
        REVIEW_DESCRIPTION: '',
        REVIEW_DESCRIPTION_PLACEHOLDER: '',
        REVIEW_OVERALL_SCORE: '',
        REVIEW_COMMENT: '',
        SUBMIT_REVIEW_COMMENT: '',
        SUBMIT_SALARY: '',
        CURRENCY: '',
        SALARY: ''
    };

    var FORM_DATA = {
        CURRENTLY_EMPLOYED: {
            YES: '',
            NO: ''
        },
        SENIORITY: {
            JUNIOR: '',
            SEMI_SENIOR: '',
            SENIOR: ''
        }
    };

    var REQUEST_ERRORS = {
        DEFAULT: ''
    };

    var LABELS = {
        LOAD_MORE_BUTTON: ''
    };

    var LOGIN = {
        TITLE: {
            ADD_REVIEW: '',
            ADD_AGENCY: '',
            COMMENT_REVIEW: '',
            FOLLOW_AGENCY: '',
            LIKE: '',
            ADD_SALARY: '',
            DISLIKE: '',
            DEFAULT: '',
            VIEW_AVERAGE_SALARY: '',
            NEWS: ''
        }

    };

    var DIALOG = {
        NO_SALARY_ENTERED: {
            TITLE: '',
            CONTENT: ''
        },
        NO_LOGIN_FOR_AVERAGE_SALARY: {
            TITLE: '',
            CONTENT: ''
        },
        SALARY_ENTERED: {
            TITLE: '',
            CONTENT: ''
        },
        REVIEW_ENTERED: {
            TITLE: '',
            CONTENT: ''
        },
        COMMENT_ADDED: {
            TITLE: '',
            CONTENT: ''
        },
        AGENCY_ENTERED: {
            TITLE: '',
            CONTENT: ''
        },
        AGENCY_FOLLOWED: {
            TITLE: '',
            CONTENT: ''
        },
        AGENCY_UNFOLLOWED: {
            TITLE: '',
            CONTENT: ''
        },
        WARNING_BEFORE_SHARING: {
            TITLE: '',
            CONTENT: ''
        }
    };

    var NOTIFICATIONS = {
      DEFAULT_NOTIFICATION_ERROR: '',
      REVIEW: {
        LIKE: '',
        DISLIKE: '',
        UNLIKE: '',
        UNDISLIKE: ''
      },
      NEWS: {
        LIKE: '',
        DISLIKE: '',
        UNLIKE: '',
        UNDISLIKE: ''
      },
      COULD_NOT_ADD_AGENCY: '',
      COULD_NOT_ADD_REVIEW: '',
      COULD_NOT_ADD_SALARY: '',
      COULD_NOT_ADD_COMMENT: '',
      AGENCY_ALREADY_EXISTS: '',
      SALARY_OUT_OF_RANGE: '',
      AGENCY_NAME_NOT_VALID: ''
    };

    this.ERROR_MESSAGES = ERROR_MESSAGES;
    this.FORM_LABELS = FORM_LABELS;
    this.REQUEST_ERRORS = REQUEST_ERRORS;
    this.FORM_DATA = FORM_DATA;
    this.LABELS = LABELS;
    this.LOGIN = LOGIN;
    this.DIALOG = DIALOG;
    this.NOTIFICATIONS = NOTIFICATIONS;
});
