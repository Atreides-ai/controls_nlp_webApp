# ControlsNLP WebApp

## Background

This is a serverless web app for interacting with the Atreides Controls NLP service. The business user guide can be found on Nuclino, here. [provide link]

## Stack

This web app is an AWS Amplify Web App which has a React Front End (bootstrapped with create-react-app) and a node.js back end. 

The package manager in use is npm. 

The Material-UI Library is used throughout to provide components that are compatible with the Google Material Style Guidelines. 

## Authentication

Authentication is provider by the AWS Cognito Service. 

Authentication is 2FA and is provided by user email, password and SMS token.

## Components

All components (unless specified) have been created using React Hooks and ES6 JS Syntax. 

### AuthComponent

This is a wrapper for the AWS Amplify [authenticator](https://aws-amplify.github.io/docs/js/authentication) component. This wrapper is required to create the login landing page, integrate react-route-dom to allow the react app to function as a single page application **and** allow CustomSignIn to replace the default SignIn component from Amplify.

### Copyright

The Copyright component renders a Material-UI Typography component that provides the text Copyright © Atreides.ai [Insert Current Year].

### CustomSignIn

This component extends the amplify SignIn class component and so does not use React Hooks. The signin component provides a CustomSignIn that allows presentation to be in line with Material-UI guidelines and fit the Atreides brand.

### Dashboard

Provides a dashboard to interact with the data returned by the Atreides Controls Package. The dashboard is built using d3 and Nivo chart. It reads data in from the users private s3 bucket so that users can only view their own data. Furthermore users can download their source file directly from s3 providing they are authenticated.

### GuidanceDialogue

A material-ui Dialogue box that pops onto the SubmitFile view to guide users on how to upload data. 

### MySnackbarContentWrapper

A wrapper for a snackbar that displays toasts during file upload.

### pieConfig

Configures the nivo pie charts on the dashboard to take in data and meet the Atreides style guidelines.

### PrivateRoute

An extension of the react-router-dom Route component to allow routes to be hidden unless the user is authenticated. This is central to the integration of aws amplfiy cognito and react-router-dom. The component takes the following props: authState, component (children) and the standard props for the route denoted by ...rest. If the user is authenticated the route is accessible.

### SignOut

This is a custom SignOut component that lets the user logout by clicking a button. The autState is set back to **SignIn** and the user is redirected back to the root login screen.

### SubmitFile

This is a view for uploading a file. It integrates the GuidanceDialogue, MySnackbarContentWrapper and Amplify-Storage to allow users to upload files to their own private s3 bucket directory for processing by the Atreides Controls NLP service.

### theme

Stores the theme for the Atreides.ai branding.

### useStyles

Creates the style guidelines for the app using the class system provided by Material-UI.

## 