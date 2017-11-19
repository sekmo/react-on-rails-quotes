import React from 'react';
import { Link } from 'react-router-dom';
import queryStringParser from 'query-string';
import axios from 'axios';

class QuotesDisplayer extends React.Component {
  constructor() {
    super();
    this.state = {
      quote: {}
    };
  }

  componentDidMount() {
    this.setQuoteIdFromQueryString(this.props.location.search);
    this.setQuote(this.quoteId);
  }

  setQuote(id) {
    axios.get(`api/quotes/${id}`)
      .then(response => {
        this.setState({ quote: response.data });
      })
      .catch(error => {
        console.error(error);
      }
    );
  }

  setQuoteIdFromQueryString(qs) {
    let queryStringParams = queryStringParser.parse(qs);
    if (queryStringParams.quote_id) {
      // assign quote ID from the URL's query string
      this.quoteId = Number(queryStringParams.quote_id);
    } else {
      this.quoteId = this.props.firstQuoteId;
      // update URL in browser to reflect current quote in query string
      this.props.history.push(`/?quote_id=${this.quoteId}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setQuoteIdFromQueryString(nextProps.location.search);
    this.setQuote(this.quoteId);
  }

  render() {
    const quote = this.state.quote;
    const nextQuoteId = quote.next_id;
    const previousQuoteId = quote.previous_id;

    return(
      <div>
        <div className='quote'>
          <p className='quote-body'>“{quote.text}”</p>
          <p className='quote-author'>– {quote.author}</p>
        </div>
        <div className='quotes__buttons'>
          {previousQuoteId ?
            <Link to={`/?quote_id=${previousQuoteId}`}>
              Previous
            </Link> :
            <Link onClick={e => e.preventDefault()} to={`javascript:void(0)`} className='disabled'>
              Previous
            </Link>
          }
          {nextQuoteId ?
            <Link to={`/?quote_id=${nextQuoteId}`}>
              Next
            </Link> :
            <Link onClick={e => e.preventDefault()} to={`javascript:void(0)`} className='disabled'>
              Next
            </Link>
          }
        </div>
      </div>
    );
  }
}

export default QuotesDisplayer;
