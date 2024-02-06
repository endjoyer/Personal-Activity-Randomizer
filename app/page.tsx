'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addSection, addActivity } from '../redux/sectionsSlice';

export default function Home() {
  const [input, setInput] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const sections = useSelector((state: RootState) => state.sections);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (selectedSection) {
      dispatch(
        addActivity({ sectionId: selectedSection, activityName: input })
      );
    } else {
      dispatch(addSection(input));
    }
    setInput('');
  };

  return (
    <main>
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        {sections.map((section) => (
          <div key={section.id} onClick={() => setSelectedSection(section.id)}>
            {section.name}
            {section.activities.map((activity) => (
              <div key={activity.id}>{activity.name}</div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
