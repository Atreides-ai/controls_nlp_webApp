import React from 'react';
import { Auth } from 'aws-amplify';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default function SignOut() {
    const signOut = () => {
        Auth.signOut().catch(err => console.log(err));
    };
    return (
        <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="small" onClick={signOut} className="signOutButton" color="secondary">
                Sign Out
            </Button>
        </Link>
    );
}
