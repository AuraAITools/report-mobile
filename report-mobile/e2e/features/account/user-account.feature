Feature: User Account Management

  As a parent
  I want to manage my account settings
  So that I can configure the app to my preferences

  Background:
    Given I am logged in as a parent
    And I am on the account screen

  Scenario: Account screen shows user info
    Then I should see my user information
    And I should see the "Sign Out" button

  Scenario: Biometric settings toggle is visible
    Then I should see the biometric unlock setting

  Scenario: Sign out navigates to login screen
    When I tap the "Sign Out" button
    And I confirm the sign-out action
    Then I should see the sign-in screen
