const { google } = require('googleapis');
const asyncHandler = require('express-async-handler');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const keyVaultName = process.env.KEY_VAULT_NAME;
const vaultUri = `https://${keyVaultName}.vault.azure.net`;
const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUri, credential);

const handleOAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const username = req.user.username; // Assume the username is available in the session or JWT
    await client.setSecret(`${username}-youtube-access-token`, tokens.access_token);
    await client.setSecret(`${username}-youtube-refresh-token`, tokens.refresh_token);

    res.redirect('/dashboard'); // Redirect to your dashboard or another appropriate page
});

module.exports = {
    handleOAuthCallback
};
