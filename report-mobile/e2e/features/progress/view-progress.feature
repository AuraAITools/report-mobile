Feature: View Student Progress

  As a parent
  I want to view my child's progress
  So that I can monitor their academic performance

  Background:
    Given I am logged in as a parent
    And I am on the progress screen

  Scenario: Progress overview is displayed
    Then I should see the progress overview
    And I should see a progress chart

  Scenario: View subject-level progress
    When I scroll down to the subject progress section
    Then I should see progress for each subject
