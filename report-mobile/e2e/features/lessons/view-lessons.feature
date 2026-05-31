Feature: View Lessons

  As a parent
  I want to see my child's lessons
  So that I can track their schedule

  Background:
    Given I am logged in as a parent
    And I am on the lessons screen

  Scenario: Lessons list is displayed
    Then I should see a list of lesson cards
    And each lesson card should show the subject name
    And each lesson card should show the time

  Scenario: Scroll through lessons
    When I scroll down on the lessons list
    Then I should see more lesson cards

  Scenario: Pull to refresh lessons
    When I pull to refresh the lessons list
    Then the lessons list should reload
