Feature: User Authentication

  As a parent user
  I want to log in to the Aura Report app
  So that I can view my child's academic reports

  Background:
    Given the app is launched fresh

  Scenario: Sign-in screen is displayed on first launch
    Then I should see the sign-in screen
    And I should see the "Sign In" button
    And I should see the "Sign Up" link

  Scenario: Navigate to sign-up screen
    When I tap the "Sign Up" link
    Then I should see the sign-up screen
    And I should see the "Full Name" input field
    And I should see the "Email" input field
    And I should see the "Password" input field

  Scenario: Navigate to forgot password screen
    When I tap the "Forgot Password" link
    Then I should see the forgot password screen
    And I should see the "Email" input field
    And I should see the "Reset Password" button

  Scenario: Successful login redirects to home
    Given I am on the sign-in screen
    When I initiate the login flow
    And I complete Keycloak authentication
    Then I should be redirected to the home screen
    And I should see the bottom navigation tabs
