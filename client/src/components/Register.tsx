import * as React from "react";
import { twStyled } from "utils/styles";
import { createUser, createSession, getPublicResource } from "utils/api";

export interface RegisterProps {}

export const RegisterStyle = twStyled.div();

export const Register: React.FC<RegisterProps> = (props: RegisterProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <RegisterStyle>
      <form onSubmit={ev => ev.preventDefault()}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
        </div>
        <button
          onClick={async () => {
            await createUser({ email, password });
            const { token } = await createSession({ email, password });
            localStorage.setItem("jwt", token);
            await getPublicResource();
          }}
        >
          {"Register"}
        </button>
      </form>
    </RegisterStyle>
  );
};
