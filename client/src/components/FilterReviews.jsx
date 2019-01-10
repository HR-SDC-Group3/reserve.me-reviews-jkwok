import React from 'react';
import PropTypes from 'prop-types';
import FilterReviewsButton from './FilterReviewsButton.jsx';
import * as Styled from './styles/FilterReviewsStyles.jsx';

const FilterReviews = (props) => {
  const { reviews, handleReviewsFilter } = props;
  const cumulativeTags = [];
  reviews.map((element) => {
    element.review.tags.forEach((tag) => {
      cumulativeTags.push(tag);
    });
    return cumulativeTags;
  });
  const cache = {};
  cumulativeTags.forEach((tag) => {
    if (!cache[tag]) {
      cache[tag] = 1;
    } else {
      cache[tag] += 1;
    }
  });
  const sortedTags = [];
  for (const tags in cache) {
    if ({}.hasOwnProperty.call(cache, tags)) {
      sortedTags.push([tags, cache[tags]]);
    }
  }
  sortedTags.sort((a, b) => b[1] - a[1]);
  const topTags = sortedTags.slice(0, 4);
  return (
    <div className="reviewFilters">
      <Styled.FilterTitle>
        Filters
      </Styled.FilterTitle>
      {topTags.map(tag => (
        <FilterReviewsButton key={tag} tag={tag} handleReviewsFilter={handleReviewsFilter} />
      ))}
    </div>
  );
};

FilterReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleReviewsFilter: PropTypes.func.isRequired,
};

export default FilterReviews;