import React from 'react';
import { Auth } from 'aws-amplify';
import Button from '@material-ui/core/Button';

export default function SignOut(){
    const signOut = () => {
        Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
    return(
        <Button size="small" onClick={signOut} className="signOutButton" color="primary">Sign Out</Button>
        )
}