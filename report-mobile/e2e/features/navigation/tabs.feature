Feature: Tab Navigation

  As a logged-in parent
  I want to navigate between app sections
  So that I can access different features

  Background:
    Given I am logged in as a parent

  Scenario: Home tab displays dashboard
    Then I should see the home screen
    And the "Home" tab should be active

  Scenario: Navigate to Lessons tab
    When I tap the "Lessons" tab
    Then I should see the lessons screen
    And the "Lessons" tab should be active

  Scenario: Navigate to Progress tab
    When I tap the "Progress" tab
    Then I should see the progress screen
    And the "Progress" tab should be active

  Scenario: Navigate to Account tab
    When I tap the "Account" tab
    Then I should see the account screen
    And the "Account" tab should be active

  Scenario: Tab state persists across navigation
    When I tap the "Lessons" tab
    And I tap the "Progress" tab
    And I tap the "Lessons" tab
    Then I should see the lessons screen
