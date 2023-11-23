<script>
  let message = 'Error 404: Page not found';
  let image = 'https://bigseo.com/wp-content/uploads/2018/03/error-404-foxplay.png';
</script>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8f8f8;
    font-family: Arial, sans-serif;
  }

  .error-message {
    font-size: 24px;
    font-weight: bold;
    color: #ff0000;
    margin-bottom: 16px;
  }

  .error-image {
    width: 200px;
    height: 200px;
    margin-bottom: 16px;
  }

  .error-description {
    font-size: 16px;
    color: #333333;
    text-align: center;
  }
</style>

<div class="error-container">
  <h1 class="error-message">Error</h1>
<img class="error-image" src={image} alt="Error Image" aria-hidden="true">
  <p class="error-description">{message}</p>
</div>
