import React from 'react';
import DefectsTable from './components/DefectsTable';

const App = () => {
  return (
    <div className="bg-[#132337] text-[#f4f4f4] min-h-screen p-6 font-nunito">
      <h1 className="text-4xl mb-8">Defects Register</h1>
      <DefectsTable />
    </div>
  );
};

export default App;
