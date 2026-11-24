# INFOREST VPN Portal

Static preview portal for the INFOREST VPN project.

## Current state
- This is a static information page only.
- It does not run a VPN server or create a tunnel.
- It does not issue subscription URLs or store credentials.
- Happ requires a real profile/subscription from a trusted, operating server.

## Publish
The `portal` directory can be deployed as a static site on a compatible static hosting service. Configure `vpn.inforest.site` only after the deployment target is selected.

## Next engineering steps
1. Select a provider and confirm its terms permit the intended private networking use.
2. Provision and secure a server with the account holder / parent where required.
3. Implement authenticated subscription delivery over HTTPS.
4. Test with Happ using a profile from that server.
5. Add device management and desktop clients only after end-to-end testing.

Never publish private keys, access tokens, subscription secrets, or user credentials in this repository.
