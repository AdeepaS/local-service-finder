import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { createReview } from '../../../services/reviewApi';

function ReviewForm({ serviceId, onSuccess }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <p className="text-gray-500 text-sm">
        <Link to="/login" className="text-primary hover:underline">Log in</Link> to write a review.
      </p>
    );
  }

  if (user.role !== 'customer') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createReview({ serviceId, rating: Number(rating), comment: comment.trim() || undefined });
      setSuccess(true);
      setComment('');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <p className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
        Thank you! Your review has been submitted.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
      <h3 className="font-bold text-gray-900">Write a review</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Share your experience..."
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  );
}

export default ReviewForm;
