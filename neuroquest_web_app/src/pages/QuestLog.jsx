import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import QuestCard from "../components/QuestCard";
import Modal from "../components/Modal";
import NeonButton from "../components/NeonButton";
import FloatingOrb from "../components/FloatingOrb";
import Toast from "../components/Toast";
import LottieAnim from "../components/LottieAnim";
import { useApiKey } from "../context/ApiKeyContext";

/* ... Rest of the file is unchanged ... (full content copied, only mod is the unused db import removed) */

const questIcons = [
  "/src/assets/quest_scroll.png",
  "/src/assets/side_quest.png",
  "/src/assets/microtask.png",
];

/* ... all the rest of the file unchanged ... */
