/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { InspectorControls } from '../components';

/**
 * Filters registered block settings, adding an `__experimentalLabel` callback if one does not already exist.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
export function addLabelCallback( settings ) {
	// If blocks provide their own label callback, do not override it.
	if ( settings.__experimentalLabel ) {
		return settings;
	}

	const supportsBlockNaming = hasBlockSupport(
		settings,
		'renaming',
		true // default value
	);

	// Check whether block metadata is supported before using it.
	if ( supportsBlockNaming ) {
		settings.__experimentalLabel = ( attributes, { context } ) => {
			const { metadata } = attributes;

			// In the list view, use the block's name attribute as the label.
			if ( context === 'list-view' && metadata?.name ) {
				return metadata.name;
			}
		};
	}

	return settings;
}

function BlockRenameControlPure( { metadata, setAttributes } ) {
	return (
		<InspectorControls group="advanced">
			<TextControl
				__nextHasNoMarginBottom
				label={ __( 'Block name' ) }
				value={ metadata?.name || '' }
				onChange={ ( newName ) => {
					setAttributes( {
						metadata: { ...metadata, name: newName },
					} );
				} }
			/>
		</InspectorControls>
	);
}

export default {
	edit: BlockRenameControlPure,
	attributeKeys: [ 'metadata' ],
	hasSupport( name ) {
		return hasBlockSupport( name, 'renaming', true );
	},
};

addFilter(
	'blocks.registerBlockType',
	'core/metadata/addLabelCallback',
	addLabelCallback
);
