import React from 'react';
import _ from 'underscore';
import ReviewList from './ReviewList.jsx';
import PaginationButtons from './PaginationButtons.jsx';
import FilterReviews from './FilterReviews.jsx';
import * as Styled from './styles/PaginationButtonStyles.jsx';

class PaginatedReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageLimit: 20,
      filters: [],
    };
    this.handlePageRender = this.handlePageRender.bind(this);
    this.handleReviewsFilter = this.handleReviewsFilter.bind(this);
  }

  handlePageRender(pageNum) {
    this.setState(() => ({
      currentPage: parseInt(pageNum, 10),
    }));
  }

  handleReviewsFilter(filter) {
    const { filters } = this.state;
    if (filters.indexOf(filter) === -1) {
      this.setState(prevState => ({
        filters: [...prevState.filters, filter],
      }));
    } else {
      const unclickedFilter = filters.filter(item => item !== filter);
      this.setState({ filters: unclickedFilter });
    }
  }
  
  render() {
    const reviews = this.state.filters.length
      ? this.props.reviews.filter(el => this.state.filters.every(tag => el.review.tags.includes(tag)))
        .slice((this.state.pageLimit * (this.state.currentPage - 1)), (this.state.pageLimit * this.state.currentPage))
      : this.props.reviews.slice((this.state.pageLimit * (this.state.currentPage - 1)), (this.state.pageLimit * this.state.currentPage));
    const pageNums = this.state.filters.length
      ? _.range(1, ((Math.ceil(reviews.length / this.state.pageLimit)) + 1))
      : _.range(1, ((Math.ceil(this.props.reviews.length / this.state.pageLimit)) + 1));
    return (
      <div className="reviewPagination">
        <FilterReviews reviews={this.props.reviews} ratingNum={this.props.ratingNum} handleReviewsFilter={this.handleReviewsFilter} />
        <ReviewList reviews={reviews} />
        <Styled.PaginationRow>
          {pageNums.map(pageNum => (
            <PaginationButtons key={pageNum} pageNum={pageNum} handlePageRender={this.handlePageRender} />
          ))}
        </Styled.PaginationRow>
      </div>
    );
  }
}

export default PaginatedReviews;