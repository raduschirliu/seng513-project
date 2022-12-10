import UserTile from "./UserTile"
import React, { useState } from 'react';

export default function UserList() {

    const dummyNames = ['Alex Zegras', 'Blaire Yankapov', 'Clive Xavier', 'Danielle Washington', 'Evan Veilleux'];

  return (
    <div>
        {dummyNames.map(dummyName => (
        <UserTile fullname={dummyName}/>
        ))}
    </div>
  );
}
