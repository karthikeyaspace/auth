import config from '../config';
import supabase from './supabaseinit';

const signUp = async (email: string, password: string) => {
  try {
    const { user, error }: any = await supabase.auth.signUp({
      email,
      password,
    });
    return { user, error };
  } catch (error) {
    return { error };
  }
};

const signIn = async (email: string, password: string) => {
  try{
    const { user, error }: any = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user, error };
  }
  catch (error) {
    return { error };
  }
};

const signInWithGoogle = async () => {
  try{
    const { error }  = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${config.SUPABASE_REDIRECT_URL}`,
      },
    });
    return { error };
  }
  catch (error) {
    return { error };
  }
};

export { signUp, signIn, signInWithGoogle };