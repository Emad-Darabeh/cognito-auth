import { AuthConfig } from './auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  ICognitoUserData,
} from 'amazon-cognito-identity-js';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
    private readonly userService: UserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser(registerRequest: {
    email: string;
    password: string;
    username: string;
  }) {
    const { email, password, username } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        async (err, result) => {
          if (!result) {
            reject(err);
          } else {
            const userId = result.userSub;

            await this.userService.createNewUser({ id: userId, username });

            resolve(result.user);
          }
        },
      );
    });
  }

  verifyUser(email: string, code: string, userSub: string) {
    const userData: ICognitoUserData = {
      Username: email,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);

    return new Promise((resolve) => {
      user.confirmRegistration(code, true, async (err, result) => {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }

        // update user verification status
        await this.userService.updateUserVerificationStatus(userSub, true);
        return resolve({ statusCode: 400, response: result });
      });
    });
  }

  authenticateUser(user: { email: string; password: string }) {
    const { email, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
