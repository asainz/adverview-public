'use strict';

App.filter('salaryColour', function(){
    return function (salary, average){
        var SALARY_COLOUR_OFFSET = 2000;

        if( !salary || !average ){
            return '';
        }

        var className = 'coloured-salary-average';

        if( salary === average ){
          return className;
        }

        salary = parseInt(salary, 10);
        average = parseInt(average, 10);

        if( salary > average + SALARY_COLOUR_OFFSET ){
            className = 'coloured-salary-gt-average';
        }

        if( salary < average + SALARY_COLOUR_OFFSET ){
            className = 'coloured-salary-lt-average';
        }

        return className;
    };
});
