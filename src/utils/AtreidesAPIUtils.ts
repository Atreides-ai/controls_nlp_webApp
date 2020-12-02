import { Auth } from 'aws-amplify';

export const generateHeaders = async (): Promise<object> => {
    const token = await Auth.currentSession().then(data => {
        return data['idToken']['jwtToken'];
    });

    const apiKey = await Auth.currentUserInfo().then(data => {
        return data['attributes']['custom:api-key'];
    });

    return new Promise((resolve, reject) => {
        resolve({ headers: { 'x-api-key': apiKey, Authorization: token } });
    });
};
