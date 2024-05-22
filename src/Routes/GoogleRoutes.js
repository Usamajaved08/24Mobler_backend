import express from "express";
// import { googleLogin } from "../Controllers/UserController.js";
// import { googleLoginCallback } from "../Controllers/UserController.js";
import passport from 'passport';
import axios from "axios";

const router = express.Router();

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get("/google", async (req, res) => {
//     try {
//         const response = await axios.get('https://accounts.google.com/o/oauth2/v2/auth', {
//             params: req.query, // Pass query parameters received from the frontend
//             headers: {
//                 'Access-Control-Allow-Origin': '*', // Set appropriate CORS headers
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//             },
//         });
//         res.send(response.data); // Send the response back to the frontend
//     } catch (error) {
//         console.error('Proxy error:', error);
//         res.status(500).send('Proxy error'); // Handle proxy errors
//     }
// });

// router.get("/google/callback", passport.authenticate('google',
//     { failureRedirect: '/login' }), (req, res) => {
//         res.redirect('/dashboard');
//     });

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/shopping-home');
    });

export default router;
