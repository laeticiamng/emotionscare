const pruneDuplicates = () => {
  const removeNodes = (selector) => {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 1) {
      nodes.forEach((node, index) => {
        if (index > 0) {
          node.remove();
        }
      });
    }
  };

  removeNodes('header');
  removeNodes('nav.fixed');
  removeNodes('footer');

  const internalHeaders = document.querySelectorAll('#root .internal-header, #root nav.fixed');
  if (internalHeaders.length > 1) {
    Array.from(internalHeaders)
      .slice(1)
      .forEach((element) => element.remove());
  }

  const internalFooters = document.querySelectorAll('#root .internal-footer, #root footer');
  if (internalFooters.length > 1) {
    Array.from(internalFooters)
      .slice(1)
      .forEach((element) => element.remove());
  }
};

window.addEventListener('DOMContentLoaded', pruneDuplicates);
window.addEventListener('load', () => {
  setTimeout(pruneDuplicates, 1000);
});
