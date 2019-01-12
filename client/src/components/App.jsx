import React from 'react';
import Url from 'url-parse';
import ReviewOverview from './ReviewOverview.jsx';
import RatingsGraph from './RatingsGraph.jsx';
import SortReviews from './SortReviews.jsx';
import PaginatedReviews from './PaginatedReviews.jsx';
import * as Styled from './styles/AppStyles.jsx';
import GlobalStyle from './styles/GlobalStyle.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      sortBy: 'newest',
      filteredReviews: [],
    };
    this.getReviewsSorted = this.getReviewsSorted.bind(this);
    this.handleRatingsFilterChange = this.handleRatingsFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
  }

  componentDidMount() {
    const url = new Url(window.location.href);
    const id = url.pathname.split('/')[2];
    fetch(`/api/restaurants/${id}/reviews`)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          reviews: data,
        });
      }).catch(err => console.error(err));
  }

  getReviewsSorted() {
    const url = new Url(window.location.href);
    const id = url.pathname.split('/')[2];
    const { sortBy } = this.state;
    fetch(`/api/restaurants/${id}/reviews?sort=${sortBy}`)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          reviews: data,
        });
      }).catch(err => console.error(err));
  }

  handleSortByChange(sort) {
    this.setState({
      sortBy: sort,
    }, () => this.getReviewsSorted());
  }

  handleRatingsFilterChange(rating) {
    const ratingNum = parseInt(rating, 10);
    const filteredReviews = this.state.reviews.filter(element => element.review.ratings.overall === ratingNum);
    this.setState({
      filteredReviews,
    });
  }

  render() {
    const pagedReviews = this.state.filteredReviews.length ? this.state.filteredReviews : this.state.reviews;
    return (
      <div className="reviewsTotal">
        <Styled.ReviewOverviewTitle>
          What
          {' '}
          {this.state.reviews.length}
          {' '}
          People are Saying
        </Styled.ReviewOverviewTitle>
        <Styled.RatingsOverviewTitle>Overall ratings and reviews</Styled.RatingsOverviewTitle>
        <Styled.RatingsOverviewTable>
          <ReviewOverview reviews={this.state.reviews} />
          <RatingsGraph reviews={this.state.reviews} handleRatingsFilter={this.handleRatingsFilterChange} />
        </Styled.RatingsOverviewTable>
        <SortReviews handleSortByChange={this.handleSortByChange} />
        <PaginatedReviews reviews={pagedReviews} />
        <GlobalStyle />
      </div>
    );
  }
}