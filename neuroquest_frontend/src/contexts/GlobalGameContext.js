import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

/**
 * GlobalGameContext manages RPG state (XP, HP, current user, streak, level, game events).
 * Scalable/contextual: Proper for modular apps/games.
 */

// Initial default state scaffold
const initialState = {
  xp: 0,
  hp: 100,
  streak: 0,
  level: 1,
  user: null,
  // You can add additional game mechanics here like {bossBattles, inventory, etc.}
};

// Core reducer handles game logic
function gameReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "GAIN_XP":
      // Example: Level up at every 100 XP
      const nextXP = state.xp + action.amount;
      const leveledUp = Math.floor(nextXP / 100) > Math.floor(state.xp / 100);
      return {
        ...state,
        xp: nextXP,
        level: leveledUp ? state.level + 1 : state.level,
      };
    case "TAKE_DAMAGE":
      return {
        ...state,
        hp: Math.max(0, state.hp - action.amount),
      };
    case "GAIN_STREAK":
      return {
        ...state,
        streak: state.streak + 1,
      };
    case "RESET_STREAK":
      return {
        ...state,
        streak: 0,
      };
    case "RESET_GAME":
      return { ...initialState, user: state.user };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
const GlobalGameContext = createContext();

/**
 * GlobalGameProvider wraps app and shares state with children.
 * Syncs `user` from AuthContext.
 */
// PUBLIC_INTERFACE
export function GlobalGameProvider({ children }) {
  const { currentUser } = useAuth();

  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    user: currentUser,
  });

  // Keep user in global state in sync with AuthContext
  useEffect(() => {
    dispatch({ type: "SET_USER", user: currentUser });
  }, [currentUser]);

  // PUBLIC_INTERFACE
  // Example actions (can expand for boss fights, quests, inventory, etc.)
  const gainXP = (amount) => dispatch({ type: "GAIN_XP", amount });
  const takeDamage = (amount) => dispatch({ type: "TAKE_DAMAGE", amount });
  const gainStreak = () => dispatch({ type: "GAIN_STREAK" });
  const resetStreak = () => dispatch({ type: "RESET_STREAK" });
  const resetGame = () => dispatch({ type: "RESET_GAME" });

  return (
    <GlobalGameContext.Provider
      value={{
        ...state,
        gainXP,
        takeDamage,
        gainStreak,
        resetStreak,
        resetGame,
        dispatch, // for flexible extension
      }}
    >
      {children}
    </GlobalGameContext.Provider>
  );
}

// PUBLIC_INTERFACE
/** useGame hook to access Game context easily */
export function useGame() {
  return useContext(GlobalGameContext);
}
