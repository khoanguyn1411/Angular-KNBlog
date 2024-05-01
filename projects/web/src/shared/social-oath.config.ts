import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

const GOOGLE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
];

const GOOGLE_CLIENT_ID = import.meta.env.NG_APP_GOOGLE_CLIENT_ID as string;

export function provideSocialOauth() {
  return {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID, {
            scopes: GOOGLE_OAUTH_SCOPES,
          }),
        },
      ],
      onError: (err) => {
        console.error(err);
      },
    } as SocialAuthServiceConfig,
  };
}
