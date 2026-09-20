document.addEventListener("DOMContentLoaded", function () {
  const bookElement = document.getElementById("my-book");

  const pageFlip = new St.PageFlip(bookElement, {
    width: 400,
    height: 600,
    size: "fixed",
    minWidth: 250,
    minHeight: 375,
    maxWidth: 1200,
    maxHeight: 1800,
    usePortrait: true,
    flippingTime: 500,
    startZIndex: 1,
    autoSize: true,
    drawShadow: true,
    maxShadowOpacity: 0.15,
    showCover: true,
    useMouseEvents: true,
  });

  // Load pages
  pageFlip.loadFromHTML(document.querySelectorAll(".my-page"));
  const tocLinks = document.querySelectorAll(".toc-link");
  tocLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageIndex = parseInt(this.dataset.page);
      pageFlip.flip(pageIndex);
    });
  });

  // Buttons
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const pageIndicator = document.getElementById("page-indicator");
  const pageInput = document.getElementById("page-input");
  const btnGoto = document.getElementById("btn-goto");

  // Previous
  btnPrev.addEventListener("click", function () {
    pageFlip.flipPrev();
  });

  // Next
  btnNext.addEventListener("click", function () {
    pageFlip.flipNext();
  });

  // Go to page
  btnGoto.addEventListener("click", function () {
    const pageNum = parseInt(pageInput.value, 10);
    const totalPages = pageFlip.getPageCount() + 1;

    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`);
      return;
    }

    const targetIndex = pageNum - 1;
    const currentIndex = pageFlip.getCurrentPageIndex();

    // Nếu đang đứng đúng ở trang được nhập rồi thì không gọi flip() nữa,
    // vì gọi flip() vào chính trang hiện tại khiến thư viện page-flip
    // không xác định đúng hướng/góc lật và gây nhảy trang loạn xạ.
    if (targetIndex === currentIndex) {
      pageInput.value = "";
      pageInput.blur();
      return;
    }

    pageFlip.flip(targetIndex);
    pageInput.value = "";
  });

  // Cho phép nhấn Enter để đi đến trang
  pageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      btnGoto.click();
    }
  });

  // Page number
  pageFlip.on("flip", function (e) {
    const currentPage = e.data + 1;
    const totalPages = pageFlip.getPageCount();

    pageIndicator.textContent = `Trang ${currentPage} / ${totalPages}`;
  });

  // Responsive
  let resizeTimer;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      pageFlip.update();
    }, 250);
  });

  // Mobile orientation
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      pageFlip.update();
    }, 500);
  });
});
