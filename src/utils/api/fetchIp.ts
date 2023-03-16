async function fetchIp() {
  const res = await fetch(
    "https://ipgeolocation.abstractapi.com/v1/?api_key=cbbe05ede2d7429cacb8c08ce9dda1f9"
  );
  const { ip_address } = await res.json();

  return ip_address;
}

export default fetchIp;
