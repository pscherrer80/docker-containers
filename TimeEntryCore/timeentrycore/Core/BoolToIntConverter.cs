using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire.Annotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace TimeEntryCore.Core
{
    public class BoolToIntConverter : ValueConverter<bool, int>
    {
        public BoolToIntConverter([CanBeNull] ConverterMappingHints mappingHints = null)
            : base(
                  v => Convert.ToInt32(v),
                  v => Convert.ToBoolean(v),
                  mappingHints)
        {
        }

        public static ValueConverterInfo DefaultInfo { get; }
            = new ValueConverterInfo(typeof(bool), typeof(int), i => new BoolToIntConverter(i.MappingHints));
    }
}
