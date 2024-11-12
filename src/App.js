import React from 'react';
import DataTable from './components/DataTable';
import Auth from './Auth';
import { supabase } from './supabaseClient';

function App() {
  const user = supabase.auth.user();

  return (
    <div className="App">
      <h1>Stakeholder Data Collection</h1>
      {user ? <DataTable /> : <Auth />}
    </div>
  );
}

export default App;
