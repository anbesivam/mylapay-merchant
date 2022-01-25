var sampleImg = `data:image/jpeg;base64,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`;
export default sampleImg;