export default function(url = []) {
  const iToken = url.indexOf('?token=');
  const iUserId = url.indexOf('&userId=');
  const iEnd = url.indexOf('#end');
  if(iToken !== -1 && iUserId !== -1 && iEnd !== -1) {
    const token = url.slice(iToken + '?token='.length, iUserId);
    const userId = url.slice(iUserId + '&userId='.length, iEnd);
    const resObj = {
      token: token,
      userId: userId,
      role: 'user'
    }
    return resObj;
  }
  return null;
};