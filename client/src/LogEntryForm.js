import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      const created = await createLogEntry(data);
      console.log(created);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='entry-form'>
      {error ? <h3 className='error'>{error}</h3> : null}
      <h3>Add New Destination </h3>
      <label htmlFor='title'>Title</label>
      <input name='title' required ref={register} />
      <label htmlFor='description'>Description </label>
      <textarea name='description' rows={3} ref={register}></textarea>
      <label htmlFor='comments'>Comments </label>
      <textarea name='comments' rows={3} ref={register}></textarea>
      <label htmlFor='image'>Image</label>
      <input name='image' ref={register} />
      <label htmlFor='visitDate'>Date Visted</label>
      <input name='visitDate' type='date' required ref={register} />
      <button disabled={loading}>
        {loading ? 'Loading ...' : 'Create Visit'}
      </button>
    </form>
  );
};

export default LogEntryForm;
