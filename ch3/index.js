const subscriber = {
  email: 'sam@pmail.com',
  rec_count: 16,
};

const rank1 = 'best';
const rank2 = 'good';

function subCouponRank(subscriber) {
  if (subscriber.rec_count > 10) {
    return 'best';
  } else {
    return 'good';
  }
}

const coupon = {
  code: '10PERCENT',
  rank: 'bad',
};

function selectCouponsByRank(coupons, rank) {
  const ret = [];

  for (let c = 0; c < coupons.length; c++) {
    const coupon = coupons[c];
    if (coupon.rank === rank) {
      ret.push(coupon);
    }
  }

  return ret;
}

function emailForSubscriber(subscriber, goods, bests) {
  const rank = subCouponRank(subscriber);

  if (rank === 'best') {
    return {
      from: 'newsletter@coupondog.co',
      to: subscriber.email,
      subject: 'Your good weekly coupons inside',
      body: 'Here are the best coupons:' + bests.join(', '),
    };
  } else {
    return {
      from: 'newsletter@coupondog.co',
      to: subscriber.email,
      subject: 'Your good weekly coupons inside',
      body: 'Here are the good coupons:' + goods.join(', '),
    };
  }
}

function emailForSubscribers(subscribers, goods, bests) {
  const emails = [];

  for (let s = 0; s < subscribers.length; s++) {
    const subscriber = subscribers[s];
    const email = emailForSubscriber(subscriber, goods, bests);
    emails.push(email);
  }

  return emails;
}

function sendIssue() {
  const coupons = fetchCouponsFromDB();
  const goodCoupons = selectCouponsByRank(coupons, 'good');
  const bestCoupons = selectCouponsByRank(coupons, 'best');
  const subscribers = fetchSubscribersFromDB();
  const emails = emailForSubscribers(subscribers, goodCoupons, bestCoupons);

  for (let e = 0; e < emails.length; e++) {
    const email = emails[e];
    emailSystem.sendEmail(email);
  }
}

function sendIssue() {
  const coupons = fetchCouponsFromDB();
  const goodCoupons = selectCouponsByRank(coupons, 'good');
  const bestCoupons = selectCouponsByRank(coupons, 'best');

  let page = 0;
  let subscribers = fetchSubscribersFromDB(page);

  while (subscribers.length > 0) {
    const emails = emailForSubscribers(subscribers, goodCoupons, bestCoupons);

    for (let e = 0; e < emails.length; e++) {
      const email = emails[e];
      emailSystem.sendEmail(email);
    }

    page++;
    subscribers = fetchSubscribersFromDB(page);
  }
}

function figurePayout(affiliate) {
  const owed = affiliate.sales * affiliate.commission;

  if (owed > 100) {
    sendPayout(affiliate.bank_code, owed);
  }
}

function affiliatePayout(affiliates) {
  for (let a = 0; a < affiliates.length; a++) {
    const affiliate = affiliates[a];
    figurePayout(affiliate);
  }
}

function main(affiliates) {
  affiliatePayout(affiliates);
}
