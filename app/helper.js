const Slabs = [
  {
    length: 4.58,
    wdith_1: 1.5,
    price_1: 810,
    width_2: 1.0,
    price_2: 505,
    width_3: 1.9,
    price_3: 890,
    weight_1: 42,
    weight_2: 31,
    weight_3: 0,
  },
  {
    length: 4.25,
    wdith_1: 1.5,
    price_1: 685,
    width_2: 1.0,
    price_2: 480,
    width_3: 1.9,
    price_3: 770,
    weight_1: 47,
    weight_2: 28,
    weight_3: 0,
  },
  {
    length: 4.0,
    wdith_1: 1.5,
    price_1: 655,
    width_2: 1.0,
    price_2: 450,
    width_3: 1.9,
    price_3: 730,
    weight_1: 40,
    weight_2: 27,
    weight_3: 0,
  },
  {
    length: 3.5,
    wdith_1: 1.5,
    price_1: 520,
    width_2: 1.0,
    price_2: 395,
    width_3: 1.9,
    price_3: 590,
    weight_1: 37,
    weight_2: 23,
    weight_3: 0,
  },
  {
    length: 3.0,
    wdith_1: 1.5,
    price_1: 465,
    width_2: 1.0,
    price_2: 355,
    width_3: 1.9,
    price_3: 570,
    weight_1: 33,
    weight_2: 21,
    weight_3: 0,
  },
];
const Girders = [
  {size: '4x9', price: 390, sizeRange: [1, 14.4], weight: 10.3},
  {size: '4x10', price: 420, sizeRange: [14.5, 16.9], weight: 11.5},
  {size: '4x10', price: 460, sizeRange: [17, 18.4], weight: 11.5},
  {size: '5x12', price: 520, sizeRange: [18.5, 20.9], weight: 16},
  {size: '5x12', price: 550, sizeRange: [21, 23.4], weight: 16},
  {size: '5x14', price: 660, sizeRange: [23.5, 25.4], weight: 20},
  {size: '5x14', price: 700, sizeRange: [25.5, Infinity], weight: 20},
];
const GWR = [
    {size:'4x9',range:8,weight:450},
    {size:'4x9',range:9,weight:450},
    {size:'4x9',range:10,weight:388},
    {size:'4x9',range:11,weight:316},
    {size:'4x9',range:12,weight:262},
    {size:'4x9',range:13,weight:450},
    {size:'4x9',range:14,weight:417},
    {size:'4x10',range:15,weight:450},
    {size:'4x10',range:16,weight:416},
    {size:'4x10',range:17,weight:409},
    {size:'4x10',range:18,weight:362},
    {size:'5x12',range:19,weight:460},
    {size:'5x12',range:20,weight:415},
    {size:'5x12',range:21,weight:370},
    {size:'5x12',range:22,weight:330},
    {size:'5x12',range:23,weight:300},
    {size:'5x14',range:24,weight:450},
    {size:'5x14',range:25,weight:410},
    {size:'5x14',range:26,weight:370},
    {size:'5x14',range:27,weight:340},
    {size:'5x14',range:28,weight:315},
];
const GetLCI = (girder_size,width,slab_length) => {
    let LCI = 0;
    const length = Math.round(width);
    for(let g in GWR) {
        if(girder_size==GWR[g].size && length==GWR[g].range) {
            LCI = GWR[g].weight/slab_length;
        }
    }
    return Math.ceil(LCI.toFixed(2));
}
const GetGrider = (width, wall, girders) => {
  const size = parseFloat(width) + 2 * (wall / 12);
  let selected = {};
  for (let girder of Girders) {
    let range = girder.sizeRange;
    if (size >= range[0] && size <= range[1]) {
      selected = {
        size: girder.size,
        price: girder.price,
        totalPrice: size * girders * girder.price,
      };
      break;
    }
  }
  return selected;
};

const AllCombinations = (s) => {
  let arr = [];
  arr.push(...Slabs);
  let combinations = [];
  while (arr.length > 1) {
    let curr = arr.shift();
    let rem = [];
    rem.push(...arr);
    const n = ~~(s / curr.length);
    let pr = n*curr.length;
    if (pr>=s-0.25 && pr<=s+0.25){
      combinations.push({
        cells: n,
        i: n,
        slab1: curr,
        j: 0,
        slab2: null,
        sum: parseFloat(s.toFixed(2)),
      });
    }
    rem.forEach(element => {
      for (let i = 1; i <= n + 1; i++) {
        for (let j = 1; j < n + 1; j++) {
          let sum = i * curr.length + j * element.length;
          if (sum >= s - 0.25 && sum <= s + 0.25) {
            combinations.push({
              cells: i + j,
              i: i,
              slab1: curr,
              j: j,
              slab2: element,
              sum: parseFloat(sum.toFixed(2)),
            });
          }
        }
      }
    });
  }
  const SortedCombination = combinations.sort((a, b) => {
    if (a.cells != b.cells) {
      return a.cells - b.cells;
    }
    if (a.slab2 === null || b.slab2 === null) {
      return a.slab2 === null ? -1 : 1;
    }
    return 0;
  });
  return SortedCombination;
};
const TotalSlabs = (item, width) => {
  let n1 = (width + 0.5) / 1.5;
  let n2 = n1 - Math.floor(n1);
  let x1 = 0;
  let x2 = 0;
  if (n2 !== 0) {
    x1 = Math.round(n1) - 1;
    if (n2.toFixed(2) == 0.33) {
      x2 = 2;
    } else {
      x2 = 1;
    }
  } else {
    x1 = Math.round(n1);
  }
  let price_1 = item.i * item.slab1.price_1 * x1;
  let price_2 = item.i * item.slab1.price_2 * x2;
  let price_3 = 0;
  let price_4 = 0;
  if (item.slab2 != null) {
    price_3 = item.j * item.slab2.price_1 * x1;
    price_4 = item.j * item.slab2.price_2 * x2;
  }

  const price = price_1 + price_2 + price_3 + price_4;
  let slab_1_string = SlbString(item.slab1.length);
  let slab_2_string = '';
  if (item.slab2 != null) {
    slab_2_string = SlbString(item.slab2.length);
  }
  return {
    x1: x1,
    x2: x2,
    price: price,
    price_1_string: `${slab_1_string} x 1-6 = ${item.i}x${x1} = ${
      item.i * x1
    } = ${price_1} RS`,
    price_2_string: `${slab_1_string} x 1= ${item.i}x${x2} = ${
      item.i * x2
    } = ${price_2} RS`,
    price_3_string: `${slab_2_string} x 1-6 = ${item.j}x${x1} = ${
      item.j * x1
    } = ${price_3} RS`,
    price_4_string: `${slab_2_string} x 1 = ${item.j}x${x2} = ${
      item.j * x2
    } = ${price_4} RS`,
  };
};
const SlbString = slab => {
  const feetPart = Math.floor(slab);
  const inchPart = Math.round((slab - feetPart) * 12);
  return `${feetPart}-${inchPart}`;
};
export {TotalSlabs, AllCombinations, GetGrider, GetLCI};
