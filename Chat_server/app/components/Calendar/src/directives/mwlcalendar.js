'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:mwlCalendar
 * @description
 * # mwlCalendar
 */
//angular.module('mwl.calendar')
  myApp.directive('mwlCalendar', function () {
    return {
      templateUrl: './components/Calendar/templates/main.html',
      restrict: 'EA',
      scope: {
        events: '=calendarEvents',
        view: '=calendarView',
        currentDay: '=calendarCurrentDay',
        control: '=calendarControl',
        eventClick: '&calendarEventClick',
        eventEditClick: '&calendarEditEventClick',
        eventDeleteClick: '&calendarDeleteEventClick',
        editEventHtml: '=calendarEditEventHtml',
        deleteEventHtml: '=calendarDeleteEventHtml',
        autoOpen: '=calendarAutoOpen',
        useIsoWeek: '=calendarUseIsoWeek',
        eventLabel: '@calendarEventLabel',
        timeLabel: '@calendarTimeLabel',
        dayViewStart:'@calendarDayViewStart',
        dayViewEnd:'@calendarDayViewEnd',
        weekTitleLabel: '@calendarWeekTitleLabel'
      },
      controller: function($scope, $timeout, $locale, moment) {


          $scope.events = [
              {
                  title: 'My first tt event title', // The title of the event
                  type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                  starts_at: new Date(2015,7,1,1), // A javascript date object for when the event starts
                  ends_at: new Date(2015,7,26,15), // A javascript date object for when the event ends
                  editable: false, // If calendar-edit-event-html is set and this field is explicitly set to false then dont make it editable
                  deletable: false // If calendar-delete-event-html is set and this field is explicitly set to false then dont make it deleteable
              }
          ];

        var self = this;

        this.titleFunctions = {};

        this.changeView = function(view, newDay) {
          $scope.view = view;
          $scope.currentDay = newDay;
        };

        $scope.control = $scope.control || {};

        $scope.control.prev = function() {
          $scope.currentDay = moment($scope.currentDay).subtract(1, $scope.view).toDate();
        };

        $scope.control.next = function() {
          $scope.currentDay = moment($scope.currentDay).add(1, $scope.view).toDate();
        };

        $scope.control.getTitle = function() {
          if (!self.titleFunctions[$scope.view]) {
            return '';
          }
          return self.titleFunctions[$scope.view]($scope.currentDay);
        };

        //Auto update the calendar when the locale changes
        var firstRunWatcher = true;
        var unbindWatcher = $scope.$watch(function() {
          return moment.locale() + $locale.id;
        }, function() {
          if (firstRunWatcher) { //dont run the first time the calendar is initialised
            firstRunWatcher = false;
            return;
          }
          var originalView = angular.copy($scope.view);
          $scope.view = 'redraw';
          $timeout(function() { //bit of a hacky way to redraw the calendar, should be refactored at some point
            $scope.view = originalView;
          });
        });

        //Remove the watcher when the calendar is destroyed
        var unbindDestroyListener = $scope.$on('$destroy', function() {
          unbindDestroyListener();
          unbindWatcher();
        });

      }
    };
  });
