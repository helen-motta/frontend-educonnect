import React from 'react';
import MenuList from './MenuList';
import { PROFILE_IDS, PROFILE_MENU_ITEMS } from './navigation/profileConfig';

export default function MenuAluno() {
  return <MenuList items={PROFILE_MENU_ITEMS[PROFILE_IDS.ALUNO]} />;
}