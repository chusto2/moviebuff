import React from 'react';
import axios from 'axios';
// import { Button, Card, Row, Col } from 'react-materialize';

import Media from 'react-media';
import { spacing } from '@material-ui/system';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import '../../App.css';
import ReviewList from '../Components/ReviewList.jsx';
import Video from '../Components/Video.jsx';

class MovieDescript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      movies: [],
    };

    this.getReviews = this.getReviews.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.addToList = this.addToList.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
  }

  // handle getting reviews for a movie when it is clicked
  getReviews(movie) {
    return axios.post(`/reviews`, {
      movieId: movie.movieId,
    })
      .then((reviews) => {
        return reviews.data.reviews;
      })
      .catch((error) => {
        console.error(error);
      });
    }
    

  // when this component is rendered, get reviews
  componentDidMount(e) {
    this.getReviews(this.props.movie)
      .then((reviews) => {
        this.setState({
          reviews: reviews,
          userVotes: this.props.userVotes,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleVote(vote) {
    const { movie } = this.props;
    return axios.put('/votes', {
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.posterPath,
      vote_count: movie.voteCount,
      vote_average: movie.voteAvg,
      numFlag: vote,
    })
      .then((res) => {
        this.setState({
          userVotes: res.data[0].userVotes,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  upvote() {
    this.handleVote(1);
  }

  downvote() {
    this.handleVote(-1);
  }

  addToList() {
    const { movie } = this.props;
    return axios.post('/movies', {
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.posterPath,
      vote_count: movie.voteCount,
      vote_average: movie.voteAvg,
      email: this.props.user.email,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  // show detailed info about movie and reviews about movie
  render() {
    const appStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const btnStyle = {
      margin: '20px',
    }

    const buttonStyle = {
      margin: '5px',
    }

    const cardStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const containerStyle = {
      margin: "20px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const { movie } = this.props;

    return (
      <div>
        <Media query="(max-width: 400px)">
          {matches =>
            matches ? (
              <div>
                <Box style={appStyle} display="flex" flexDirection="column">
                  <Card display="flex" style={cardStyle} >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {movie.title}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" component="p">
                          {movie.overview}
                        </Typography>
                        <br />
                        <Typography gutterBottom variant="h5" component="h2">
                          Average Rating: {movie.voteAvg}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <br />
                  <br />
                  <img src={`https://image.tmdb.org/t/p/w300/${movie.posterPath}`} alt="" />
                  <Box style={appStyle} display="flex" flexDirection="column">
                    <Button style={buttonStyle} onClick={this.upvote} variant="contained" color="primary">Upvote</Button>
                    <h5>{this.state.userVotes}</h5>
                    <Button style={buttonStyle} onClick={this.downvote} variant="contained" color="primary">Downvote</Button>
                    <Button style={buttonStyle} onClick={this.addToList} variant="contained" color="primary">Add to Watchlist</Button>
                  </Box>
                  <Video movie={movie} />
                  <ReviewList reviews={this.state.reviews} />
                </Box>
              </div>
            ) : (
                <div>
                  <Box style={appStyle} display="flex" flexDirection="column">
                  <Card display="flex" style={cardStyle} >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {movie.title}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" component="p">
                          {movie.overview}
                        </Typography>
                        <br />
                        <Typography gutterBottom variant="h5" component="h2">
                          Average Rating: {movie.voteAvg}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <br />
                  <br />
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`} alt="" />
                  <Box style={appStyle} display="flex" justifyContent="space-around" flexDirection="row" flexWrap="wrap">
                      <Button style={btnStyle} onClick={this.upvote} variant="contained" color="primary">Upvote</Button>
                      <h5 m={2}>{this.state.userVotes}</h5>
                      <Button style={btnStyle} onClick={this.downvote} variant="contained" color="primary">Downvote</Button>
                      <Button style={btnStyle} onClick={this.addToList} variant="contained" color="primary">Add to Watchlist</Button>
                    </Box>
                    <Video movie={movie} />
                    <ReviewList reviews={this.state.reviews} />
                  </Box>
              </div>
              )
          }
        </Media>
      </div>
    );
  }
}

export default MovieDescript;