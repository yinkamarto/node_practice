import { UserPayload } from '../controllers/authController.ts';

// Use declaration merging to add your custom property to the Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload; // Add an optional 'user' property of type UserPayload
      // or 'auth' if using libraries like express-jwt
    }
  }
}